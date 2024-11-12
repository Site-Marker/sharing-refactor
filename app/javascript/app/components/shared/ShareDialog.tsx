import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"

import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { User } from '@/models';
import { set } from 'date-fns';
export default function ShareDialog({
    handleUpdateUserPermission,
    handleAddUser,
    saveUserPermissions,
    isOpen,
    onClose,
    title = 'Share',
    users,
}: {
    handleUpdateUserPermission: (userEmail: string, permission: 'admin' | 'edit' | 'view', resource: any, user:User) => void;
    handleAddUser: (newUserEmail: string, permission: 'admin' | 'edit' | 'view') => void;
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    users?: User[];
    saveUserPermissions: (User);
}) {

    const [userList, setUserList] = useState(users);
    const [userAux, setUserAux] = useState<User>();
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPermission, setNewUserPermission] = useState<'admin' | 'edit' | 'view'>('view');

    const getPermissionLabel = (permission: 'admin' | 'edit' | 'view' | undefined | null) => {
        console.log("getPermissionLabel",permission);
        if (!permission) return 'Select permission';

        switch (permission) {
            case 'admin':
                return 'Admin'; 
            case 'edit':
                return 'Edit';
            case 'view':
                return 'View';
            default:
                return 'Select permission';
        }
    };

    // PRONTO, é isso
    const adicionaUsuario = (newUserEmail: string, permission: 'admin' | 'edit' | 'view') => {
        console.log('adicionaUsuario', newUserEmail, permission);
        handleAddUser(newUserEmail, permission);
    }

    const atualizaPermissao = (permissaoNova: any, userEmail:string, resource: any, user:User) => {
        console.log('atualiza Permissao > ', userEmail, permissaoNova, resource, user);
        setUserAux(permissaoNova);

        if(resource == 'projectRole'){
            user.projectRole = permissaoNova;
        }

        if(resource == 'documentRole'){
            user.documentRole = permissaoNova;
        }

        if(resource == 'reportRole'){
            user.reportRole = permissaoNova;
        }

        console.log('depois switch Permissao > ', user);
        handleUpdateUserPermission(userEmail, permissaoNova, resource, user);
    }

    return <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-2xl">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
                <div className="flex space-x-2">
                    <Input
                        placeholder="User email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                    />
                    <Select value={newUserPermission} onValueChange={(value: 'admin' | 'edit' | 'view') => setNewUserPermission(value)}>
                        <SelectTrigger className="w-[200px] bg-gray-700 text-white border-gray-600">
                            <SelectValue>{newUserPermission}</SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 text-white border-gray-600">
                            <SelectItem value="admin">
                                <div className="flex flex-col">
                                    <span>admin</span>
                                    <span className="text-xs text-gray-400">Can edit and manage permissions</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="edit">
                                <div className="flex flex-col">
                                    <span>Edit</span>
                                    <span className="text-xs text-gray-400">Can make changes to the project</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="view">
                                <div className="flex flex-col">
                                    <span>View</span>
                                    <span className="text-xs text-gray-400">Can only view the project</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => adicionaUsuario(newUserEmail, newUserPermission)}>Add</Button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {/*
                    Users iteration 
                     */}

                    {users?.map?.((user: User) => (
                        // (userAux? setUserAux(user): null ),
                        <div key={user.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                            <div className="flex items-center space-x-2">
                                <Avatar>
                                    <AvatarImage src={user.avatar_url} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-gray-400">{user.email}</p>
                                </div>

                                <div className="permissionRole">
                                <p className="text-sm text-gray-400 text-center">Projects</p>
                                 <Select
                                value={user.projectRole}
                                onValueChange={(value: 'admin' | 'edit' | 'view') => atualizaPermissao(value, user.email, 'projectRole', user)}
                            >
                                <SelectTrigger className="bg-gray-600 text-white border-gray-500">
                                    <SelectValue>{user.projectRole}</SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 text-white border-gray-600">
                                    <SelectItem value="admin">
                                        <div className="flex flex-col">
                                            <span>admin</span>
                                            <span className="text-xs text-gray-400">Can edit and manage permissions</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="edit">
                                        <div className="flex flex-col">
                                            <span>Edit</span>
                                            <span className="text-xs text-gray-400">Can make changes to the project</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="view">
                                        <div className="flex flex-col">
                                            <span>View</span>
                                            <span className="text-xs text-gray-400">Can only view the project</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                                </div>



                                <div className="permissionRole">
                                <p className="text-sm text-gray-400 text-center">Documents</p>
                                 <Select
                                value={user.documentRole}
                                onValueChange={(value: 'admin' | 'edit' | 'view') => atualizaPermissao(value, user.email, 'documentRole', user)}
                            >
                                <SelectTrigger className="bg-gray-600 text-white border-gray-500">
                                    <SelectValue>{user.documentRole}</SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 text-white border-gray-600">
                                    <SelectItem value="admin">
                                        <div className="flex flex-col">
                                            <span>admin</span>
                                            <span className="text-xs text-gray-400">Can edit and manage permissions</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="edit">
                                        <div className="flex flex-col">
                                            <span>Edit</span>
                                            <span className="text-xs text-gray-400">Can make changes to the project</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="view">
                                        <div className="flex flex-col">
                                            <span>View</span>
                                            <span className="text-xs text-gray-400">Can only view the project</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                                </div>


                                <div className="permissionRole">
                                <p className="text-sm text-gray-400 text-center">Reports</p>
                                 <Select
                                value={user.reportRole}
                                onValueChange={(value: 'admin' | 'edit' | 'view') => atualizaPermissao(value, user.email, 'reportRole', user)}
                            >
                                <SelectTrigger className="bg-gray-600 text-white border-gray-500">
                                    <SelectValue>{user.reportRole}</SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 text-white border-gray-600">
                                    <SelectItem value="admin">
                                        <div className="flex flex-col">
                                            <span>admin</span>
                                            <span className="text-xs text-gray-400">Can edit and manage permissions</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="edit">
                                        <div className="flex flex-col">
                                            <span>Edit</span>
                                            <span className="text-xs text-gray-400">Can make changes to the project</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="view">
                                        <div className="flex flex-col">
                                            <span>View</span>
                                            <span className="text-xs text-gray-400">Can only view the project</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                                </div>
                                <Button className='align-self-end' onClick={() => saveUserPermissions(user)}>Save</Button>
                        </div>
                        </div>
                    ))}
                    {/*
                    Users iteration 
                     */}
                </div>
            </div>
        </DialogContent>
    </Dialog>
}
