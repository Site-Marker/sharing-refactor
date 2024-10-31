import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { User } from '@/models';
export default function ShareDialog({
    handleUpdateUserPermission,
    handleAddUser,
    isOpen,
    onClose,
    title = 'Share',
    users,
}: {
    handleUpdateUserPermission: (userId: number, permission: 'full access' | 'edit' | 'view') => void;
    handleAddUser: () => void;
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    users?: User[];
}) {

    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPermission, setNewUserPermission] = useState<'full access' | 'edit' | 'view'>('view');

    const getPermissionLabel = (permission: 'full access' | 'edit' | 'view' | undefined | null) => {
        if (!permission) return 'Select permission';

        switch (permission) {
            case 'full access':
                return 'Full Access';
            case 'edit':
                return 'Edit';
            case 'view':
                return 'View';
            default:
                return 'Select permission';
        }
    };

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
                    <Select value={newUserPermission} onValueChange={(value: 'full access' | 'edit' | 'view') => setNewUserPermission(value)}>
                        <SelectTrigger className="w-[200px] bg-gray-700 text-white border-gray-600">
                            <SelectValue>{getPermissionLabel(newUserPermission)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 text-white border-gray-600">
                            <SelectItem value="full access">
                                <div className="flex flex-col">
                                    <span>Full Access</span>
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
                    <Button onClick={handleAddUser}>Add</Button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {users?.map?.((user: User) => (
                        <div key={user.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                            <div className="flex items-center space-x-2">
                                <Avatar>
                                    <AvatarImage src={user.avatar_url} alt={user.name} />
                                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-gray-400">{user.email}</p>
                                </div>
                            </div>
                            <Select
                                value={user.permission}
                                onValueChange={(value: 'full access' | 'edit' | 'view') => handleUpdateUserPermission(user.id, value)}
                            >
                                <SelectTrigger className="w-[200px] bg-gray-600 text-white border-gray-500">
                                    <SelectValue>{getPermissionLabel(user.permission || null)}</SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 text-white border-gray-600">
                                    <SelectItem value="full access">
                                        <div className="flex flex-col">
                                            <span>Full Access</span>
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
                    ))}
                </div>
            </div>
        </DialogContent>
    </Dialog>
}
