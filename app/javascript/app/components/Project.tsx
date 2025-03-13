import React, { useState } from 'react'
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { Plus, FileText, Upload, Share2, ArrowLeft } from "lucide-react"
import { Link, useParams, useSearchParams } from 'react-router-dom'
import useFetchProject from '@/api/useFetchProject'
import { ListLoader } from './Projects'
import useFetchReports from '@/api/useFetchReports'
import { Document, Project, User } from '@/models'
import { Report } from '@/models/Report'
import { format } from "date-fns";
import useCreateReport from '@/api/useCreateReport'
import useFetchDocuments from '@/api/useFetchDocuments'
import useCreateDocument from '@/api/useCreateDocument'
import useFetchUsers from '@/api/useFetchUsers'
import ShareDialog from './shared/ShareDialog'
import Header from './shared/Header'
import Layout from './shared/Layout'
import Page from './shared/Page'
import useShareResource from '@/api/useShareResource'
import { SharingPermission } from '@/models/SharingPermission'
import useDeleteShareResource from '@/api/useDeleteShareResource'

type HandleShare = (item: Report | Document | Project, type: SharingPermission['resource_type']) => void;

export default function Component({ user } : { user : User }) {
    const [searchParams] = useSearchParams();
    const shared = searchParams.get('shared');

    const { id } = useParams<{ id: string }>();

    const { isPending, data: project } = useFetchProject(id, !!shared);
    const { isPending: usersPending, data: users } = useFetchUsers();

    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [sharingItem, setSharingItem] = useState<Report | Document | typeof project | null>(null);
    const [resourceType, setResourceType] = useState<SharingPermission['resource_type']>('project')
    const [existingPermissions, setExistingPermissions] = useState<User[]>([])

    const handleShare = (item: Report | Document | typeof project, type: SharingPermission['resource_type']) => {
        setSharingItem(item);
        setResourceType(type);
        setExistingPermissions(item.sharing_permissions);
        setIsShareDialogOpen(true);
    };

    const { mutate: shareResourceMutate } = useShareResource(resourceType, () => setIsShareDialogOpen(false));
    const { mutate: shareDeleteMutate } = useDeleteShareResource(resourceType, () => setIsShareDialogOpen(false));

    const accessLevel = project?.sharing_permissions?.find((permission : User ) => permission.id === user.id)?.permission;

    return (
        <Layout>
            <Header>
                <Button asChild>
                    <Link to="/" className="flex items-center">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Projects
                    </Link>
                </Button>
            </Header>

            <Page>
                {isPending ? <ListLoader /> : <>
                    <Card className="bg-gray-800 border-gray-700 mb-6 text-white">
                        <CardHeader>
                            <CardTitle className="text-2xl">{project.name}</CardTitle>
                            <CardDescription className="text-gray-300">{project.description}</CardDescription>
                        </CardHeader>
                        {(accessLevel === 'full access' || !shared) && (
                        <CardContent className="text-white">
                            <h3 className="text-lg font-semibold mb-2">Available Users:</h3>
                            <div className="flex flex-wrap gap-2">
                                {usersPending && <ListLoader height={'h-6'} />}
                                {users?.map?.((user: User) => (
                                    <div key={user.id} className="flex items-center bg-gray-700 rounded-full px-3 py-1">
                                        <Avatar className="w-6 h-6 mr-2">
                                            <AvatarImage src={user.avatar_url} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{user.name}</span>
                                    </div>
                                ))}
                            </div>
                            <Button variant="link" className="mt-2 text-white" onClick={() => handleShare(project, 'project')}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Manage Sharing
                            </Button>
                        </CardContent>
                        )}
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2">
                        <ProjectReports handleShare={handleShare} shared={!!shared} accessLevel={accessLevel} />
                        <ProjectDocuments handleShare={handleShare} shared={!!shared} accessLevel={accessLevel} />
                    </div>
                </>}
            </Page>
            <ShareDialog
                users={users}
                resourceId={sharingItem?.id}
                permissions={existingPermissions}
                title={sharingItem ? resourceType === 'project' ? `Share Project: ${project.name}` : 'title' in sharingItem ? `Share Report: ${sharingItem.title}` : `Share Document: ${sharingItem.name}` : 'Share'}
                isOpen={isShareDialogOpen}
                onClose={() => setIsShareDialogOpen(false)}
                handleUpdateUserPermission={function (userId: number, resourceId : number, permission: 'full access' | 'edit' | 'view'): void {
                    shareResourceMutate({
                        user_id: userId,
                        resource_type: resourceType,
                        access_level: permission,
                        ...(resourceType === 'project' && { project_id: resourceId }),
                        ...(resourceType === 'document' && { document_id: resourceId }),
                        ...(resourceType === 'report' && { report_id: resourceId }),
                    });
                }}
                handleDeleteUserPermission={function (userId: number, resourceId : number) {
                    shareDeleteMutate({
                        user_id: userId,
                        resource_type: resourceType,
                        ...(resourceType === 'project' && { project_id: resourceId }),
                        ...(resourceType === 'document' && { document_id: resourceId }),
                        ...(resourceType === 'report' && { report_id: resourceId }),
                    })
                }}
            />
        </Layout>
    )
}

const ProjectReports = ({ handleShare, shared, accessLevel }: {
    handleShare: HandleShare;
    shared: boolean;
    accessLevel: SharingPermission['access_level']
}) => {
    const { id: projectId } = useParams<{ id: string }>();
    const { isPending, data: reports } = useFetchReports(shared, projectId);
    const { mutate } = useCreateReport(projectId);

    const [newReportTitle, setNewReportTitle] = useState('');

    const handleCreateReport = () => {
        if (newReportTitle.trim()) {
            const newReport: Report = {
                title: newReportTitle.trim(),
            };
            mutate(newReport);
            setNewReportTitle('');
        }
    };

    return <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
            <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Reports
            </CardTitle>
        </CardHeader>
        <CardContent className="text-white">
            {isPending && <ListLoader height={'h-16'} />}
            <div className="space-y-2 mb-4">
                {reports?.map?.((report: Report) => (
                    <div key={report.id} className="flex justify-between items-center bg-gray-700 px-3 py-2 rounded text-white">
                        <Link to={`/reports/${report.id}`} className="hover:text-gray-300">{report.title}</Link>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-300">{format(new Date(report.created_at || ''), "MM/dd/yyyy")}</span>
                            {(accessLevel === 'full access' || !shared) && (
                            <Button variant="link" size="icon" onClick={() => handleShare(report, 'report')}>
                                <Share2 className="h-4 w-4 text-white" />
                            </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {!shared && (
                <div className="flex space-x-2">
                    <Input
                        placeholder="New report title"
                        value={newReportTitle}
                        onChange={(e) => setNewReportTitle(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                    />
                    <Button onClick={handleCreateReport}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create
                    </Button>
                </div>
            )}
            
        </CardContent>
    </Card>
}

const ProjectDocuments = ({ handleShare, shared, accessLevel }: {
    handleShare: HandleShare;
    shared: boolean;
    accessLevel: SharingPermission['access_level']
}) => {
    const { id: projectId } = useParams<{ id: string }>();

    const { isPending, data: documents } = useFetchDocuments(!!shared, projectId);
    const { mutate } = useCreateDocument(projectId);


    const [newDocumentName, setNewDocumentName] = useState('');

    const handleAddDocument = () => {
        if (newDocumentName.trim()) {
            const newDocument: Document = {
                id: documents.length + 1,
                name: newDocumentName.trim(),
            };
            mutate(newDocument);
            setNewDocumentName('');
        }
    };


    return <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
            <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Documents
            </CardTitle>
        </CardHeader>
        <CardContent className="text-white">
            {isPending && <ListLoader height={'h-16'} />}
            <div className="space-y-2 mb-4">
                {documents?.map?.((document: Document) => (
                    <div key={document.id} className="flex justify-between items-center bg-gray-700 px-3 py-2 rounded text-white">
                        <Link to={`/documents/${document.id}`} className="hover:text-gray-300">{document.name}</Link>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-300">{format(new Date(document.created_at || ''), "MM/dd/yyyy")}</span>
                            {(accessLevel === 'full access' || !shared) && (<Button variant="link" size="icon" onClick={() => handleShare(document, 'document')}>
                                <Share2 className="h-4 w-4 text-white" />
                            </Button>)}
                        </div>
                    </div>
                ))}
            </div>
            {!shared && (
            <div className="flex space-x-2">
                <Input
                    placeholder="New document name"
                    value={newDocumentName}
                    onChange={(e) => setNewDocumentName(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                />
                <Button onClick={handleAddDocument}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                </Button>
            </div>
            )}
        </CardContent>
    </Card>;
}
