import {create} from 'zustand'

const conversationStore = create((set=>({
    selectedConversation : null,
    setSelectedConversation : (selectedConversation)=>set({selectedConversation}),
    messages :[],
    setMessages : (messages)=>set({messages})
})))

export default conversationStore