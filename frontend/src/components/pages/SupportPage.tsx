import { useState } from "react";
import { MessageCircle, Mail, Phone, Search, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { motion } from "motion/react";

interface SupportPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function SupportPage({ onNavigate }: SupportPageProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot", time: "10:30 AM" }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const faqs = [
    {
      question: "How do I cancel my flight booking?",
      answer: "You can cancel your booking by going to 'My Bookings', finding your reservation, and clicking the 'Cancel Booking' button. Cancellation fees may apply based on fare rules."
    },
    {
      question: "What documents do I need for my flight?",
      answer: "You'll need a valid government-issued photo ID (passport for international flights) and your booking confirmation. Some destinations may require additional documentation like visas."
    },
    {
      question: "Can I change my flight date?",
      answer: "Yes, you can change your flight date through the 'Manage Booking' section. Date change fees and fare differences may apply depending on your ticket type."
    },
    {
      question: "How early should I arrive at the airport?",
      answer: "We recommend arriving at least 2 hours before domestic flights and 3 hours before international flights to allow time for check-in, security, and boarding."
    },
    {
      question: "What is the baggage allowance?",
      answer: "Baggage allowance varies by airline and fare class. Typically, Economy class includes 1 cabin bag (7kg) and 1 check-in bag (23kg). Check your booking details for specific allowances."
    },
    {
      question: "How do I get a refund?",
      answer: "Refunds are processed based on your fare rules. Go to 'Manage Booking' and select 'Request Refund'. Refunds typically take 7-10 business days to process."
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { 
        text: newMessage, 
        sender: "user", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setNewMessage("");
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: "Thanks for your message! Our team will get back to you shortly.",
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl text-gray-900 mb-4">How Can We Help?</h1>
          <p className="text-xl text-gray-600">We're here 24/7 to assist you</p>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card
            onClick={() => setChatOpen(!chatOpen)}
            className="bg-white border-0 shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600">Chat with our support team</p>
          </Card>

          <Card className="bg-white border-0 shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600">support@skywings.com</p>
          </Card>

          <Card className="bg-white border-0 shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600">1-800-SKYWINGS</p>
          </Card>
        </motion.div>

        {/* Chat Interface */}
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            className="mb-12"
          >
            <Card className="bg-white border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
                <h3 className="text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Live Chat Support
                </h3>
              </div>
              <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-white border-t flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-blue-600 to-blue-500"
                >
                  Send
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border-0 shadow-lg p-8">
            <h2 className="text-2xl text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search for answers..."
                  className="pl-10"
                />
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-blue-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card className="bg-white border-0 shadow-lg p-8">
            <h2 className="text-2xl text-gray-900 mb-6">Send Us a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" className="mt-2" />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What is this regarding?" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue or question..."
                  rows={5}
                  className="mt-2"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 h-12">
                Submit Message
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
