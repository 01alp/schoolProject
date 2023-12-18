import React, { useState, useEffect, useContext } from 'react';
import { UsersContext } from './users-context';

export const WebSocketContext = React.createContext({
  websocket: null,
  newPrivateMsgsObj: null,
  setNewPrivateMsgsObj: () => {},
  newGroupMsgsObj: null,
  setNewGroupMsgsObj: () => {},
  newNotiObj: null,
  setNewNotiObj: () => {},
  newNotiFollowReplyObj: null,
  setNewNotiFollowReplyObj: () => {},
  newNotiJoinReplyObj: null,
  setNewNotiJoinReplyObj: () => {},
  newNotiInvitationReplyObj: null,
  setNewNotiInvitationReplyObj: () => {},
  newOnlineStatusObj: false,
  setNewOnlineStatusObj: () => {},
});

export const WebSocketContextProvider = (props) => {
  const [socket, setSocket] = useState(null);
  const [newPrivateMsgsObj, setNewPrivateMsgsObj] = useState(null);
  const [newGroupMsgsObj, setNewGroupMsgsObj] = useState(null);

  const [newNotiObj, setNewNotiObj] = useState(null);
  const [newNotiFollowReplyObj, setNewNotiFollowReplyObj] = useState(null);
  const [newNotiJoinReplyObj, setNewNotiJoinReplyObj] = useState(null);
  const [newNotiInvitationReplyObj, setNewNotiInvitationReplyObj] = useState(null);

  const [newOnlineStatusObj, setNewOnlineStatusObj] = useState(false);

  const currUserId = localStorage.getItem('user_id');

  const usersCtx = useContext(UsersContext);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8080/ws');

    newSocket.onopen = () => {
      console.log('ws connected');
      setSocket(newSocket);
    };

    newSocket.onclose = () => {
      console.log('bye ws');
      setSocket(null);
    };

    newSocket.onerror = (err) => console.log('ws error');

    newSocket.onmessage = (e) => {
      // console.log('msg event: ', e);
      // console.log('msg event data : ', e.data, 'data finished');
      const combinedMsgObj = JSON.parse(e.data);

      if (combinedMsgObj.messages && Array.isArray(combinedMsgObj.messages)) {
        combinedMsgObj.messages.forEach((msgObj) => {
          console.log('New ws msg: ', msgObj)

          switch (msgObj.type) {
            case ('followRequest'):
              setNewNotiObj({
                id: 'follow_req_' + msgObj.payload.id, //Using source userID as id/key, because it's always unique
                type: 'follow-req',
                sourceid: msgObj.payload.id,
                targetid: Number(currUserId),
              });
              break;
            case ('onlineUsersList'):
              if (msgObj.payload !== null) {
                let onlineIds = [];
                msgObj.payload.forEach((userData) => onlineIds.push(userData.id))
                setNewOnlineStatusObj({onlineUserIds: onlineIds});
              }
              break;
            case ('userOnline'):
              setNewOnlineStatusObj({userOnline: msgObj.payload.id});
              break;
            case ('userOffline'):
              setNewOnlineStatusObj({userOffline: msgObj.payload.id});
              break;
            default: 
              console.log('Received unknown type ws message');
              break;
          }
          // if (msgObj.type === 'followRequest') {
          //   setNewNotiObj({
          //     id: 'follow_req_' + msgObj.payload.id, //Using source userID as id/key, because it's always unique
          //     type: 'follow-req',
          //     sourceid: msgObj.payload.id,
          //     targetid: Number(currUserId),
          //   });
          // }
          // if (msgObj.label === 'p-chat') {
          //   console.log('ws receives private msg (wsctx): ', msgObj.message);
          //   setNewPrivateMsgsObj(msgObj);
          // } else if (msgObj.label === 'g-chat') {
          //   console.log('ws receives grp msg (wsctx): ', msgObj.message);
          //   setNewGroupMsgsObj(msgObj);
          // } else if (msgObj.label === 'noti') {
          //   if (
          //     msgObj.type === 'follow-req' ||
          //     msgObj.type.includes('event-notif') ||
          //     msgObj.type === 'join-req' ||
          //     msgObj.type === 'invitation'
          //   ) {
          //     console.log('ws receives noti (wsctx): ', msgObj);
          //     console.log('ws receives noti type (wsctx): ', msgObj.type);
          //     setNewNotiObj(msgObj);
          //   } else if (msgObj.type === 'followRequest') {
          //     console.log('ws receives noti follow reply (wsctx): ', msgObj);
          //     console.log('ws receives noti follow reply type (wsctx): ', msgObj.type);
          //     console.log('ws receives noti follow reply accepted (wsctx): ', msgObj.accepted);
          //     setNewNotiFollowReplyObj(msgObj);
          //   } else if (msgObj.type === 'join-req-reply') {
          //     console.log('ws receives noti join-req-reply (wsctx): ', msgObj);
          //     console.log('ws receives noti join-req-reply type (wsctx): ', msgObj.type);
          //     console.log('ws receives noti join-req-reply accepted (wsctx): ', msgObj.accepted);
          //     setNewNotiJoinReplyObj(msgObj);
          //   } else if (msgObj.type === 'invitation-reply') {
          //     console.log('ws receives noti invitation-reply (wsctx): ', msgObj);
          //     console.log('ws receives noti invitation-reply type (wsctx): ', msgObj.type);
          //     console.log('ws receives noti invitation-reply accepted (wsctx): ', msgObj.accepted);
          //     setNewNotiInvitationReplyObj(msgObj);
          //   }
          // } else if (msgObj.label === 'online-status') {
          //   console.log('ws receives online-status (wsctx): ', msgObj);
          //   console.log('ws receives online-status onlineuserids (wsctx): ', msgObj.onlineuserids);
          //   setNewOnlineStatusObj(msgObj);
          //   usersCtx.onNewUserReg();
          // }
        });
      };
    };

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        websocket: socket,
        newPrivateMsgsObj: newPrivateMsgsObj,
        setNewPrivateMsgsObj: setNewPrivateMsgsObj,
        newGroupMsgsObj: newGroupMsgsObj,
        setNewGroupMsgsObj: setNewGroupMsgsObj,
        newNotiObj: newNotiObj,
        setNewNotiObj: setNewNotiObj,
        newNotiFollowReplyObj: newNotiFollowReplyObj,
        setNewNotiFollowReplyObj: setNewNotiFollowReplyObj,
        newNotiJoinReplyObj: newNotiJoinReplyObj,
        setNewNotiJoinReplyObj: setNewNotiJoinReplyObj,
        newNotiInvitationReplyObj: newNotiInvitationReplyObj,
        setNewNotiInvitationReplyObj: setNewNotiInvitationReplyObj,
        newOnlineStatusObj: newOnlineStatusObj,
        setNewOnlineStatusObj: setNewOnlineStatusObj,
      }}
    >
      {props.children}
    </WebSocketContext.Provider>
  );
};
