import React, { useState } from 'react'
import { Button } from "@/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card"
import { Share2, ArrowLeft, Edit, FileText } from "lucide-react"
import { useParams } from 'react-router-dom'
import { ListLoader } from './Projects'
import { User } from '@/models'
import { Report } from '@/models/Report'
import { format } from "date-fns";
import useFetchUsers from '@/api/useFetchUsers'
import ShareDialog from './shared/ShareDialog'
import Header from './shared/Header'
import Layout from './shared/Layout'
import Page from './shared/Page'
import useFetchReport from '@/api/useFetchReport'
import LinkGoBack from './shared/LinkGoBack'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog'
import { Label } from '@/ui/label'
import { Input } from '@/ui/input'
import useUpdateReport from '@/api/useUpdateReport'
import UserAvatar from './shared/UserAvatar'

export default function Component() {

    const { id } = useParams<{ id: string }>();

    const { isPending, data: report } = useFetchReport(id);
    const { mutate } = useUpdateReport(id);
    const { isPending: usersPending, data: users } = useFetchUsers();

    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [sharingItem, setSharingItem] = useState<Report | null>(null);
    const [newReportTitle, setNewReportTitle] = useState('');

    const handleShare = (item: Report) => {
        setSharingItem(item);
        setIsShareDialogOpen(true);
    };

    const handleUpdateReport = () => {
        mutate({ title: newReportTitle });
        setIsEditDialogOpen(false);
    }

    return (
        <Layout>
            <Header>
                <Button asChild>
                    <LinkGoBack className="flex items-center">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </LinkGoBack>
                </Button>
            </Header>

            <Page>
                {isPending ? <ListLoader /> : <>
                    <Card className="bg-gray-800 border-gray-700 mb-6 text-white">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center mb-3"><FileText className="w-10 h-10 mr-2" />Report</CardTitle>
                            <div className="text-xl text-gray-200">
                                {report.title}
                            </div>
                            <div className="text-sm text-gray-400">
                                Created on {format(new Date(report.created_at), 'MMMM dd, yyyy')}
                            </div>
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-20" onClick={() => setIsEditDialogOpen(true)}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-800 text-white border-gray-700">
                                    <DialogHeader>
                                        <DialogTitle>Update Report</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="projectName">Name</Label>
                                            <Input
                                                id="projectName"
                                                value={!!newReportTitle ? newReportTitle : report.title}
                                                onChange={(e) => setNewReportTitle(e.target.value)}
                                                className="bg-gray-700 text-white border-gray-600"
                                            />
                                        </div>
                                        <Button onClick={handleUpdateReport} className="w-full">Update Report</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="text-white">
                            <h3 className="text-lg font-semibold mb-2">Available Users:</h3>
                            <div className="flex flex-wrap gap-2">
                                {usersPending && <ListLoader height={'h-6'} />}
                                {users?.map?.((user: User) => (
                                    <UserAvatar key={user.id} user={user}/>
                                ))}
                            </div>
                            <Button variant="link" className="mt-2 text-white" onClick={() => handleShare(report)}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Manage Sharing
                            </Button>
                        </CardContent>
                    </Card>
                </>}
            </Page>
            <ShareDialog
                users={users}
                title={sharingItem ? `Share Report: ${sharingItem.title}` : 'Share'}
                isOpen={isShareDialogOpen}
                onClose={() => setIsShareDialogOpen(false)}
                handleUpdateUserPermission={function (userId: number, permission: 'full access' | 'edit' | 'view'): void {
                    alert('Function not implemented.')
                }} handleAddUser={function (): void {
                    alert('Function not implemented.')
                }}
            />
        </Layout>
    )
}
