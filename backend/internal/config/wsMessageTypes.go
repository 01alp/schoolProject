package config

type wsMessageTypes struct {
	CLIENT_WS_READY    string
	ONLINE_USERS_LIST  string
	USER_ONLINE        string
	USER_OFFLINE       string
	CHAT_MSGS          string
	CHAT_MSGS_REPLY    string
	FOLLOW_REQ         string
	FOLLOW_REQ_REPLY   string
	MSG_HANDLING_ERROR string
}

var WsMsgTypes = wsMessageTypes{
	CLIENT_WS_READY:    "readyForWsMessages",
	ONLINE_USERS_LIST:  "onlineUsersList",
	USER_ONLINE:        "userOnline",
	USER_OFFLINE:       "userOffline",
	CHAT_MSGS:          "chatMessages",
	CHAT_MSGS_REPLY:    "chatMessagesReply",
	FOLLOW_REQ:         "followRequest",
	FOLLOW_REQ_REPLY:   "followRequestReply",
	MSG_HANDLING_ERROR: "messageHandlingError",
}
