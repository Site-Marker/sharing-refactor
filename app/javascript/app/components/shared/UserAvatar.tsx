import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { User } from "@/models"

const UserAvatar: React.FC<{ user: User }> = ({ user }) => {
    return (
        <div key={user.id} className="flex items-center bg-gray-700 rounded-full px-3 py-1">
            <Avatar className="w-6 h-6 mr-2">
                <AvatarImage src={user.avatar_url} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{user.name || user.email}</span>
        </div>
    );
}


export default UserAvatar;