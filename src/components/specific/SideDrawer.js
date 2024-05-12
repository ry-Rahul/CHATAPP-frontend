import React, { useEffect, useState } from "react";
import {
  Button,
  Tooltip,
  Box,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  Spinner,
  useToast,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/hooks";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { ChatState } from "../../context/ChatProvider";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const {user,setSelectedChat,chats ,setChats ,AVAILABLE,setAvailable} = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    axios.get("/api/user/logout");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(`/api/user/users?search=${search}`);

      setLoading(false);

      if (data.length === 0) {
        toast({
          title: "No User Found",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top-left",
        });
        return;
      }

      console.log(data);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


  useEffect(() => {
      const res = axios.post("api/user/status", { AVAILABLE });

  }, [AVAILABLE]);

  const availableHandler = () => {
      
     if(AVAILABLE===false){
        setAvailable(true);
     }else{
        setAvailable(false);
     }
  };


//   ACCESS CHAT _______________________________________________________
  const accessChat = async (userId) => {
    // console.log(userId);

    try {
      setLoadingChat(true);
      
      const { data } = await axios.post("/api/chat", { userId });
    //   console.log(data);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#7f8f85"
        w="100%"
        p="5px 10px 5px 10px"
        borderBottom="1px"
      >
        <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <FaSearch />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Tabs
          display="flex"
          variant="soft-rounded"
          size="sm"
          colorScheme="green"
          justifyContent="center"
          alignItems="center"
        >
          <TabList>
            <Tab onClick={availableHandler}>Available</Tab>
            <Tab onClick={availableHandler}>Busy</Tab>
          </TabList>
        </Tabs>

        <Tooltip label="Logout" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={logoutHandler}>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Logout
            </Text>
            <LuLogOut />
          </Button>
        </Tooltip>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults?.map((user) => (
              
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
