import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Input from '../../components/Input';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined.js';
import {fetchMessages, createMessage,} from "../../redux/actions/messageActions";
import axios from "axios";
import socket from "../../socket.js";
import UserIcon from "../../components/UserIcon";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CallImage from "../../components/CallImage";



const ResChatPage = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message.messages);
  const selectedChatId = useSelector((state) => state.chat.selectedChatId);
  const userId = useSelector((state) => state.user.userId);
  const user = useSelector((state) => state.user.user);
  const newMessageRef = useRef(null);
  const friendsUsername = useSelector((state) => state.friend.friendUsername);
  const friendsList = useSelector((state) => state.friend.friendsList);
  const chats = useSelector((state) => state.chat.chats);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedChatId) {
      axios
        .get(`http://localhost:3501/api/messages/${selectedChatId}`)
        .then((res) => {
          dispatch(fetchMessages(res.data));
        })
        .catch((error) => console.error('Error fetching messages:', error));
      // Fetch messages for the selected chat
    }
  }, [selectedChatId, dispatch]);

  const selectedChat = chats.find((chat) => {
    return chat.chatId === selectedChatId;
  });

  useEffect(() => {
    const handleMessageReceive = (data) => {
      dispatch(createMessage(data));
    };

    // Listen for 'receive_message' event and handle it with handleMessageReceive
    socket.on('receive_message', handleMessageReceive);
    // Return a cleanup callback to turn off the event listener when the component unmounts
    return () => {
      socket.off('receive_message', handleMessageReceive);
      // socket.disconnect();
    };
  }, [dispatch]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        chatId: selectedChatId,
        senderId: userId,
        receiverId: messages?.receiver?.receiverId,
        text: newMessageRef.current.value,
        message: newMessageRef.current.value,
      };
      await axios.post('/api/message', payload);
      socket.emit('send_message', payload);
      newMessageRef.current.value = '';
      fetchUpdatedMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchUpdatedMessages = () => {
    axios
      .get(`http://localhost:3501/api/messages/${selectedChatId}`)
      .then((res) => {
        dispatch(fetchMessages(res.data));
      })
      .catch((error) => console.error('Error fetching messages:', error));
  };

  function backToConversations() {
    navigate('/welcome');
  }

  return (
    <main className="bg-white w-full h-screen flex flex-col justify-center items-center ">
      <div className="fixed top-4 w-full h-[80px] bg-gray-100 rounded-full flex items-center justify-center">
        <section>
          <div>
            <button
              className="xxs:fixed xxs:left-5 xxs:font-medium xxs:text-lg xxs:mt-1 lg:hidden"
              onClick={backToConversations}
            >
              <KeyboardBackspaceIcon fontSize="large" />
            </button>
          </div>
          <UserIcon userId={selectedChatId?.user?.userId} />
        </section>
        <div>
          <h3 className="text-lg font-medium">{friendsUsername}</h3>
        </div>
      </div>
      <div className="h-[80%] mt-8 w-full  border-b overflow-y-auto">
        <div className="p-14">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.messageId} className="flex flex-col mb-6">
                <div
                  className={`flex items-center ${
                    userId === msg.userId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {userId !== msg.userId && (
                    <UserIcon userId={msg.userId} className=" shrink-0" />
                  )}

                  <div
                    className={`max-w-[80%] rounderd-b-xl p-4 mb-6 
          ${
            userId === msg.userId
              ? 'bg-orange-400 text-white rounded-tl-xl mr-2'
              : 'bg-blue-400 text-white rounded-tr-xl ml-2 '
          }`}
                  >
                    {msg.message}
                  </div>
                  {userId === msg.userId && (
                    <UserIcon userId={msg.userId} className=" shrink-0" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-lg font-semibold mt-24">
              No Messages or No Conversation Selected
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-2  flex items-center w-96 ">
        <Input
          className=" w-[100%]  ml-1.5 border  "
          placeholder={`message ${friendsUsername} here...`}
          type="text"
          required
          // onChange={(e) => setSendMessage(e.target.value)}
          newMessage={newMessageRef}
        />
        <div className="w-[10%]">
          <button
            className="w-full"
            onClick={(e) => handleSendMessage(e)}
            type="submit"
          >
            <ArrowCircleRightOutlinedIcon fontSize="large" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default ResChatPage;
