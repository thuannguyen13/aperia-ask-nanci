// Multi-turn scripted conversation flows for the Clover / business-owner embed.
// These play back when a user types an exact matching prompt in those modes.

import type { ScriptedTurn } from "../types"

export const CLOVER_CONVERSATIONS: Record<string, ScriptedTurn[]> = {
  "Change my business address": [
    { role: "user", content: "Change my business address" },
    { role: "assistant", content: "Sure. Your current business address on file is:\n\n142 Oak Street, Austin, TX 78701\n\nWhat would you like to change it to? Please include street, city, state, and ZIP.", map: { address: "142 Oak Street, Austin, TX 78701", lat: 30.2645, lng: -97.7430 } },
    { role: "user", content: "1100 S Congress Ave, Austin, TX 78704" },
    { role: "assistant", content: "Got it — just to confirm, you'd like to update your business address from 142 Oak Street, Austin, TX 78701 to:\n\n1100 S Congress Ave, Austin, TX 78704\n\nIs that correct?\n\n{{MAP}}", map: { address: "1100 S Congress Ave, Austin, TX 78704", lat: 30.2515, lng: -97.7494 } },
    { role: "user", content: "Yes, that's correct." },
    { role: "assistant", content: "Done! Your business address has been updated to 1100 S Congress Ave, Austin, TX 78704. The change will be reflected on your account within 1–2 business days. You'll receive a confirmation email at your primary address shortly." },
  ],
  "Update my primary email": [
    { role: "user", content: "Update my primary email" },
    { role: "assistant", content: "Of course. Your current primary email is teresa.w@email.com — this is where we send account notifications, receipts, and important updates.\n\nWhat would you like to change it to?" },
    { role: "user", content: "teresa.walker@walkerbiz.com" },
    { role: "assistant", content: "Just to confirm — you want to change your primary email from teresa.w@email.com to teresa.walker@walkerbiz.com. Is that right?" },
    { role: "user", content: "Yes, go ahead." },
    { role: "assistant", content: "Your primary email has been updated to teresa.walker@walkerbiz.com. A confirmation link has been sent to your old address to verify the change. Future notifications will go to the new address once confirmed." },
  ],
  "Update my phone number": [
    { role: "user", content: "Update my phone number" },
    { role: "assistant", content: "No problem. Your current phone number on file is (512) 334-7821, used for account verification and support callbacks.\n\nWhat's the new number you'd like to use?" },
    { role: "user", content: "(415) 867-5309" },
    { role: "assistant", content: "To confirm — updating your contact number from (512) 334-7821 to (415) 867-5309. Correct?" },
    { role: "user", content: "That's right." },
    { role: "assistant", content: "Your phone number has been updated to (415) 867-5309. If you ever need to verify your account, that's the number we'll use going forward." },
  ],
  "Change my statement descriptor": [
    { role: "user", content: "Change my statement descriptor" },
    { role: "assistant", content: "Sure — your statement descriptor is what appears on your customers' credit card statements after a purchase. Your current descriptor is \"WALKER'S BOOKS\" (13 characters).\n\nWhat would you like it to say? Keep it under 22 characters so it displays cleanly." },
    { role: "user", content: "WALKER BISTRO SF" },
    { role: "assistant", content: "\"WALKER BISTRO SF\" is 16 characters — perfect. Just to confirm, this will replace \"WALKER'S BOOKS\" on all new transactions. Ready to update?" },
    { role: "user", content: "Yes, update it." },
    { role: "assistant", content: "Done! Your statement descriptor has been changed to \"WALKER BISTRO SF\". It will appear on all new transactions going forward. Existing pending transactions may still show the old descriptor." },
  ],
  "Update customer service phone": [
    { role: "user", content: "Update customer service phone" },
    { role: "assistant", content: "Got it. Your current customer service number is (512) 334-7821 — this is what appears on receipts and cardholder dispute communications.\n\nWhat would you like to change it to?" },
    { role: "user", content: "(415) 555-0192" },
    { role: "assistant", content: "Confirm update from (512) 334-7821 to (415) 555-0192 for customer service? This will appear on all future receipts." },
    { role: "user", content: "Yes, confirm." },
    { role: "assistant", content: "Updated! Your customer service phone is now (415) 555-0192. Customers will see this number on their receipts starting with your next batch." },
  ],
  "Update my business name": [
    { role: "user", content: "Update my business name" },
    { role: "assistant", content: "I can help with that. Your business name is currently registered as \"Walker's Roadhouse LLC\".\n\nWhat would you like to change it to? If this is a legal entity name change, you may need to provide supporting documentation such as an updated business license." },
    { role: "user", content: "Walker's Roadhouse & Catering LLC" },
    { role: "assistant", content: "Got it — changing from \"Walker's Roadhouse LLC\" to \"Walker's Roadhouse & Catering LLC\". Is this a legal name change or just a DBA (doing business as) update?" },
    { role: "user", content: "It's a legal name change." },
    { role: "assistant", content: "Understood. Your business name has been updated to Walker's Roadhouse & Catering LLC. Since this is a legal name change, our compliance team may follow up within 2–3 business days to request a copy of your updated documentation. Heads up — your statement descriptor on customer receipts still reads \"WALKER'S BOOKS.\" Would you like me to update that to match the new business name too? You'll receive a confirmation at your primary email shortly." },
  ],
}
