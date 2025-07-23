"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Music,
  Mail,
  MessageCircle,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { contactFormSchema, type ContactFormData } from "@/lib/validation";

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    try {
      contactFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
      }
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        setSubmitMessage(result.message);
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
        setSubmitMessage(result.message || "Failed to send message");
      }
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4 font-poppins">
            Contact Us
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have a question, suggestion, or need help? We'd love to hear from
            you. The BareLyrics team is here to help.
          </p>
        </div>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3 max-w-4xl mx-auto">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">{submitMessage}</p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3 max-w-4xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{submitMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl text-black font-poppins">
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="firstName"
                        className="text-black font-medium"
                      >
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className={`mt-2 border-gray-300 focus:border-black ${
                          errors.firstName ? "border-red-500" : ""
                        }`}
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="lastName"
                        className="text-black font-medium"
                      >
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        className={`mt-2 border-gray-300 focus:border-black ${
                          errors.lastName ? "border-red-500" : ""
                        }`}
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-black font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      className={`mt-2 border-gray-300 focus:border-black ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-black font-medium">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="What's this about?"
                      className={`mt-2 border-gray-300 focus:border-black ${
                        errors.subject ? "border-red-500" : ""
                      }`}
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-black font-medium">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your question or feedback..."
                      className={`mt-2 min-h-[150px] border-gray-300 focus:border-black resize-none ${
                        errors.message ? "border-red-500" : ""
                      }`}
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white py-3"
                    disabled={isSubmitting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & FAQ */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-black font-poppins">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-black">Email</p>
                    <p className="text-sm text-gray-600">team@barelyrics.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-black">Response Time</p>
                    <p className="text-sm text-gray-600">
                      Usually within 24 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-black">Support Hours</p>
                    <p className="text-sm text-gray-600">
                      Monday - Friday, 9AM - 6PM EST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Questions */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-black font-poppins">
                  Common Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-black mb-1">
                    How do I submit lyrics?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Visit our{" "}
                    <Link href="/submit" className="text-black hover:underline">
                      Submit Lyrics
                    </Link>{" "}
                    page and fill out the form with song details.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">
                    How long does review take?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Songs are added immediately and reviewed by our community
                    for quality.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">
                    Can I request a song?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Yes! Contact us with the song details and we'll try to add
                    it to our collection.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">
                    Found incorrect lyrics?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Use our contact form to report issues or submit a correction
                    through our lyrics form.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Team Info */}
            <Card className="border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-medium text-black mb-2 font-poppins">
                  The BareLyrics Team
                </h3>
                <p className="text-sm text-gray-600">
                  We're a small team of music lovers dedicated to providing
                  accurate, clean lyrics for everyone to enjoy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
