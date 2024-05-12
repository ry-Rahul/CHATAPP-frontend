import React, { useState } from "react";

import { Box } from "@chakra-ui/layout";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/specific/SideDrawer";
import MyChats from "../components/specific/MyChats";
import Chatbox from "../components/specific/Chatbox";

export default function ChatPage() {
  const { user } = ChatState();
  // console.log(user)

  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain}  />}
        {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
}
