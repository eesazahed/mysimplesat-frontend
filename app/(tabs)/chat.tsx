import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import TextArea from "@/components/ui/TextArea";
import ThemedText from "@/components/ui/ThemedText";
import TypewriterMessage from "@/components/ui/TypewriterMessage";
import { RootStackParamList } from "@/types";
import askAI, { systemPrompt } from "@/utils/askAI";
import feedbackPrompt from "@/utils/feedbackPrompt";
import renderLatex from "@/utils/renderLatex";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";

interface Message {
  id: number;
  sender: "ai" | "user";
  content: string;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const systemMessage: ChatMessage = {
  role: "system",
  content: systemPrompt,
};

const Chat = () => {
  const colorScheme = useColorScheme();

  const route = useRoute<RouteProp<RootStackParamList, "chat">>();
  const userAnswer = route.params?.userAnswer;

  const [clearButtonText, setClearButtonText] = useState("Clear Chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    systemMessage,
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  const addMessage = async (newMessage: Omit<Message, "id">) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...newMessage, id: prevMessages.length },
    ]);
  };

  const updateLastMessage = async (newContent: string) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      const lastIndex = updatedMessages.length - 1;
      updatedMessages[lastIndex] = {
        ...updatedMessages[lastIndex],
        content: newContent,
      };
      return updatedMessages;
    });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    await addMessage({ sender: "user", content: input });
    setChatHistory((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    await addMessage({ sender: "ai", content: "Generating response..." });

    const AIResponse = await askAI(input, true, chatHistory);

    if (AIResponse !== null) {
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: AIResponse },
      ]);
    }

    await updateLastMessage(
      AIResponse || "Failed to generate. Please try again."
    );

    setLoading(false);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const clearChat = () => {
    setClearButtonText("Clearing...");
    setMessages([]);
    setChatHistory([systemMessage]);
    setLoading(false);
    setTimeout(() => {
      setClearButtonText("Clear Chat");
    }, 1000);
  };

  useEffect(() => {
    if (userAnswer) {
      clearChat();
      setInput(feedbackPrompt(userAnswer));
    }
  }, [userAnswer]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Container>
        <View
          style={[
            styles.chatContainer,
            {
              borderRadius: 12,
              backgroundColor: colorScheme === "dark" ? "#323232" : "#ccc",
            },
          ]}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={{ padding: 24 }}
            showsVerticalScrollIndicator={true}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.message,
                  {
                    alignSelf:
                      message.sender === "ai" ? "flex-start" : "flex-end",
                  },
                ]}
              >
                {message.sender === "ai" ? (
                  <TypewriterMessage content={message.content} />
                ) : (
                  <ThemedText style={styles.userMessageText}>
                    {renderLatex(message.content, "dark")}
                  </ThemedText>
                )}
              </View>
            ))}
          </ScrollView>

          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colorScheme === "dark" ? "black" : "#6c6c6c" },
            ]}
          >
            <TextArea
              value={input}
              onChangeText={setInput}
              placeholder="What would you like help with?"
              minHeight={100}
              style={styles.input}
              containerStyle={{
                marginBottom: 0,
                marginTop: 0,
              }}
            />
            <Button
              title="Send"
              style={styles.button}
              onPress={handleSendMessage}
              disabled={!!(input.trim().length === 0 || loading)}
            />
          </View>
        </View>

        <Button
          title={clearButtonText}
          style={{ marginVertical: 32, backgroundColor: "#d32f2f" }}
          onPress={clearChat}
          disabled={messages.length === 0}
        />
      </Container>
    </ScrollView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    marginTop: 64,
  },
  messagesContainer: {
    flex: 1,
  },
  inputContainer: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingTop: 12,
  },
  input: {
    marginTop: 4,
    marginHorizontal: 12,
    marginBottom: 6,
    maxHeight: 200,
  },
  button: {
    marginBottom: 16,
    marginHorizontal: 12,
    marginTop: 10,
    borderWidth: 0,
  },
  message: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  userMessageText: {
    padding: 12,
    borderRadius: 12,
    borderBottomRightRadius: 0,
    backgroundColor: "#007AFF",
    color: "white",
  },
});
