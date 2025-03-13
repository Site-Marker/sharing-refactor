import React, { useState } from 'react'
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog"
import { Label } from "@/ui/label"
import { Textarea } from "@/ui/textarea"
import { Plus, Share2, Loader2 } from "lucide-react"
import { Link } from 'react-router-dom'
import { Project } from '@/models'
import useFetchProjects from '@/api/useFetchProjects'
import useCreateProject from '@/api/useCreateProject'
import useFetchUsers from '@/api/useFetchUsers'
import ShareDialog from './shared/ShareDialog'
import Header from './shared/Header'
import Layout from './shared/Layout'
import Page from './shared/Page'

export default function Component() {

    const { isPending, data: projects } = useFetchProjects();
    const { mutate } = useCreateProject();

    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { data: users } = useFetchUsers();

    const handleCreateProject = () => {
        if (newProjectName.trim()) {
            const newProject: Project = {
                name: newProjectName.trim(),
                description: newProjectDescription.trim(),
            };

            mutate(newProject);
            setNewProjectName('');
            setNewProjectDescription('');
            setIsCreateDialogOpen(false);
        }
    };

    const handleShareProject = (project: Project) => {
        setSelectedProject(project);
        setIsShareDialogOpen(true);
    };

    return (
        <Layout>
            <Header />
            <Page>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Your Projects</h2>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="secondary">
                                <Plus className="w-5 h-5 mr-2" />
                                Create Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 text-white border-gray-700">
                            <DialogHeader>
                                <DialogTitle>Create New Project</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="projectName">Name</Label>
                                    <Input
                                        id="projectName"
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        className="bg-gray-700 text-white border-gray-600"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="projectDescription">Description</Label>
                                    <Textarea
                                        id="projectDescription"
                                        value={newProjectDescription}
                                        onChange={(e) => setNewProjectDescription(e.target.value)}
                                        className="bg-gray-700 text-white border-gray-600"
                                    />
                                </div>
                                <Button onClick={handleCreateProject} className="w-full">Create Project</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects?.map?.((project: Project) => (
                        <Card key={project.id} className="bg-gray-800 border-gray-700 h-[220px]">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-white">{project.name}</CardTitle>
                                <Button variant="link" size="icon" onClick={() => handleShareProject(project)}>
                                    <Share2 className="h-4 w-4 text-white" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-gray-400 mb-4 h-[40px]">{project.description}</CardDescription>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button asChild variant="outline" className="w-full hover:text-gray-700">
                                    <Link to={`/projects/${project.id}`}>
                                        View Project
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                {isPending && <ListLoader />}
            </Page>
            <ShareDialog
                users={users}
                title={`Share Project: ${selectedProject?.name}`}
                isOpen={isShareDialogOpen}
                onClose={() => setIsShareDialogOpen(false)}
                handleUpdateUserPermission={function (): void {
                    alert('Function not implemented.')
                }} handleAddUser={function (): void {
                    alert('Function not implemented.')
                }} />
        </Layout>
    )
}

export const ListLoader = ({
    height = 'h-32',
}: {
    height?: string,
}) => <div className={`w-full ${height} flex items-center justify-center`}>
        <Loader2 className="animate-spin" />
    </div>