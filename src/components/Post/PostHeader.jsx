import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Modal from "../Modal";
import { UserContext } from "../Application";
import { firestore, fieldValue, createChat } from "../../firebase";
import { MdMoreHoriz, MdSend } from "react-icons/md";
import { UserLink } from "../User/UserExports";
import { Menu, MenuItem, PostInfoWrapper } from "../StyledComponents";

export default function PostHeader({ user, post }) {
    const { currentUser } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const history = useHistory();
    const postRef = firestore.collection("user-posts").doc(post.id);
    const userRef = firestore.collection("users").doc(user.uid);

    async function handleDelete() {
        try {
            setOpen(false);
            await userRef.update({
                posts: fieldValue.arrayRemove(post.id),
            });
            await postRef.delete();
            // need to delete image from storage
        } catch (error) {
            console.error(error.message);
        }
    }

    function handleComments() {
        postRef.update({
            commentsOn: !post.commentsOn,
        });
    }

    function handleReactions() {
        postRef.update({
            reactionsOn: !post.reactionsOn,
        });
    }

    async function handleMessaging() {
        let commonChat;
        currentUser.chats.forEach((chat) => {
            user.chats.forEach((userChat) => {
                if (userChat.id === chat.id) {
                    commonChat = chat.id;
                }
            });
        });
        if (commonChat) {
            history.push(`/messaging/${commonChat}`);
        } else {
            const chatId = await createChat(currentUser, user);
            history.push(`/messaging/${chatId}`);
        }
    }

    function PostOptions() {
        return (
            <Menu>
                <MenuItem>Edit Caption</MenuItem>
                <MenuItem onClick={handleComments}>
                    {post.commentsOn ? "Turn Comments Off" : "Turn Comments On"}
                </MenuItem>
                <MenuItem onClick={handleReactions}>
                    {post.reactionsOn
                        ? "Turn Reactions Off"
                        : "Turn Reactions On"}
                </MenuItem>
                <MenuItem onClick={handleDelete}>Delete Post</MenuItem>
            </Menu>
        );
    }

    return (
        <PostInfoWrapper>
            <UserLink user={user} />
            {currentUser.uid === user.uid ? (
                <MdMoreHoriz onClick={() => setOpen(true)} />
            ) : (
                <MdSend onClick={handleMessaging} />
            )}
            {open ? (
                <Modal setOpen={setOpen} content={<PostOptions />} />
            ) : null}
        </PostInfoWrapper>
    );
}
