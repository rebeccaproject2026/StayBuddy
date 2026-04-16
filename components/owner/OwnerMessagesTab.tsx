"use client";

import { MessageSquare } from "lucide-react";
import ChatWindow from "@/components/ChatWindow";

interface OwnerMessagesTabProps {
  isDark: boolean;
  language: string;
  contactRequests: any[];
  requestsLoading: boolean;
  activeChatRequestId: string | null;
  setActiveChatRequestId: (id: string | null) => void;
  socketMarkSeen: (id: string) => void;
  resetUnread: () => void;
  user: any;
  ownerToken: string | null;
  unreadByRequest: Record<string, number>;
}

export default function OwnerMessagesTab({
  isDark, language,
  contactRequests, requestsLoading,
  activeChatRequestId, setActiveChatRequestId,
  socketMarkSeen, resetUnread,
  user, ownerToken, unreadByRequest,
}: OwnerMessagesTabProps) {
  return (
    <div className="flex gap-4 overflow-hidden" style={{ height: "calc(100vh - 130px)" }}>
      {/* Conversation list */}
      <div className={`w-full lg:w-72 xl:w-80 flex-shrink-0 rounded-xl border overflow-hidden flex flex-col ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
        <div className={`px-4 py-3 border-b font-semibold text-sm ${isDark ? "border-gray-800 text-white" : "border-gray-100 text-gray-900"}`}>
          {language === "fr" ? "Conversations" : "Conversations"}
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {requestsLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`h-14 rounded-xl animate-pulse ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
              ))}
            </div>
          ) : contactRequests.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className={`w-8 h-8 mx-auto mb-2 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                {language === "fr" ? "Aucune conversation" : "No conversations yet"}
              </p>
            </div>
          ) : (
            contactRequests.map((req: any) => (
              <button
                key={req._id}
                onClick={() => { setActiveChatRequestId(req._id); socketMarkSeen(req._id); }}
                className={`w-full text-left px-4 py-3 transition-colors ${
                  activeChatRequestId === req._id
                    ? isDark ? "bg-primary/20" : "bg-primary/10"
                    : isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{req.fullName}</p>
                  {(unreadByRequest[req._id] || 0) > 0 && (
                    <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadByRequest[req._id] > 9 ? "9+" : unreadByRequest[req._id]}
                    </span>
                  )}
                </div>
                <p className={`text-xs truncate mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{req.propertyTitle}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat window — desktop */}
      <div className="flex-1 min-w-0 min-h-0 hidden lg:flex flex-col">
        {activeChatRequestId ? (
          (() => {
            const req = contactRequests.find((r: any) => r._id === activeChatRequestId);
            return (
              <ChatWindow
                requestId={activeChatRequestId}
                currentUserId={user!.id}
                otherUserName={req?.renter?.fullName || req?.fullName || "Tenant"}
                propertyTitle={req?.propertyTitle || ""}
                token={ownerToken}
                isDark={isDark}
                onUnreadChange={resetUnread}
              />
            );
          })()
        ) : (
          <div className={`h-full rounded-xl border flex flex-col items-center justify-center gap-3 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <MessageSquare className={`w-12 h-12 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
            <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              {language === "fr" ? "Sélectionnez une conversation" : "Select a conversation to start chatting"}
            </p>
          </div>
        )}
      </div>

      {/* Mobile: full-screen chat overlay */}
      {activeChatRequestId && (
        <div className="lg:hidden fixed inset-0 z-50 p-4" style={{ background: isDark ? "#030712" : "#f9fafb" }}>
          {(() => {
            const req = contactRequests.find((r: any) => r._id === activeChatRequestId);
            return (
              <ChatWindow
                requestId={activeChatRequestId}
                currentUserId={user!.id}
                otherUserName={req?.renter?.fullName || req?.fullName || "Tenant"}
                propertyTitle={req?.propertyTitle || ""}
                token={ownerToken}
                isDark={isDark}
                onClose={() => setActiveChatRequestId(null)}
                onUnreadChange={resetUnread}
              />
            );
          })()}
        </div>
      )}
    </div>
  );
}
