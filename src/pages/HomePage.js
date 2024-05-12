import {
  Box,
  Container,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import { useNavigate } from "react-router-dom";

function HomePage() {

    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
    
        if (user) {
             navigate("/chats");
        }
      }, []);


  return (
    <Container
        maxW={{
            base: "100%",
            md: "100%",
            lg: "40%",
            xl: "40%",
        }}
      centerContent
      justifyItems={"center"}
      alignContent={"center"}
    >
      <Flex justify="center" align="center" direction="column" p={10}>
        <Text fontSize={{ base: '18px', md: '30px', lg: '30px' }} fontWeight="bold" color="blue.500">
          Welcome to Chat App
        </Text>
      </Flex>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="2px">

        <Tabs isFitted variant="soft-rounded" colorScheme="blue">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{<Login/> }</TabPanel>
            <TabPanel>{<SignUp/>}</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;
