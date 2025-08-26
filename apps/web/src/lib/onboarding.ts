import {
  coreCreateThread,
  coreInsertAnchor,
  coreInsertMessage,
} from "@/lib/db/core";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function createWelcomeThread(supabase: SupabaseClient) {
  try {
    // Create the main welcome thread
    const welcomeThread = await coreCreateThread(
      supabase,
      null, // root thread
      "Welcome 👋"
    );

    // Create the welcome message
    const welcomeMessage = await coreInsertMessage(
      supabase,
      welcomeThread.id,
      "assistant",
      `👋 **Welcome to Fractalchat!**

This is not just a chat — it's a **conversation tree**. You can select any part of my reply and create a branch to explore it further, without losing the main flow.

Anchors you create will be highlighted in yellow and saved — click them anytime to jump directly into that sub-thread.

---

**For example:** 

Photosynthesis is the process by which plants convert sunlight, **carbon dioxide**, and water into glucose and oxygen.

Try selecting "glucose" above to see how branching works!`
    );

    // Create a sample branch thread to demonstrate the concept
    const branchThread = await coreCreateThread(
      supabase,
      welcomeThread.id,
      "carbon dioxide"
    );

    await coreInsertMessage(
      supabase,
      branchThread.id,
      "user",
      "What's carbon dioxide?"
    );

    // Create a message in the branch thread
    const carbonDioxideMessage = await coreInsertMessage(
      supabase,
      branchThread.id,
      "assistant",
      `**Carbon dioxide (CO₂)** is a colorless gas made of one carbon atom and two oxygen atoms. It plays several important roles:

- 🌬️ **Breathing & Life Cycles** – Humans and animals exhale carbon dioxide, while plants take it in during *photosynthesis* and convert it into oxygen and energy-rich sugars.
- 🌍 **Climate & Greenhouse Effect** – CO₂ traps heat in the atmosphere, helping keep Earth warm enough for life. But too much of it from burning **fossil fuels** contributes to *climate change*.
- 🥤 **Everyday Uses** – It's what makes *fizzy drinks* bubbly, is used in fire extinguishers, and helps in refrigeration systems.

This is an example of how you can branch off from any part of a conversation to explore specific topics in depth!`
    );

    // Create a sub-sub thread for fossil fuels
    const fossilFuelsThread = await coreCreateThread(
      supabase,
      branchThread.id, // child of carbon dioxide thread
      "fossil fuels"
    );

    await coreInsertMessage(
      supabase,
      fossilFuelsThread.id,
      "user",
      "Why are they called fossil fuels?"
    );

    await coreInsertMessage(
      supabase,
      fossilFuelsThread.id,
      "assistant",
      `Great question! They're called "**fossil fuels**" because they're literally made from ancient fossils:

🦴 **Ancient Origins** – Fossil fuels (coal, oil, natural gas) formed from the remains of plants and animals that lived millions of years ago.

⏰ **Time & Pressure** – Over millions of years, these organic remains were buried under layers of sediment, compressed, and heated, slowly transforming into energy-rich substances.

🌿 **Coal** comes from ancient forests and swamps
🦕 **Oil & Natural Gas** come from ancient marine organisms (tiny sea creatures, algae)

So when we burn fossil fuels today, we're literally burning ancient life! That's why they contain so much stored energy – it's millions of years of concentrated sunlight that those ancient organisms captured through photosynthesis.

This also explains why they're "non-renewable" – they take millions of years to form!`
    );

    // Create an anchor linking the welcome message to the branch
    await coreInsertAnchor(supabase, welcomeMessage.id, branchThread.id, {
      exact: "carbon dioxide",
      prefix: "sunlight, ",
      suffix: ", and water",
    });

    // Create an anchor linking the carbon dioxide message to the fossil fuels sub-thread
    await coreInsertAnchor(
      supabase,
      carbonDioxideMessage.id,
      fossilFuelsThread.id,
      {
        exact: "fossil fuels",
        prefix: "burning ",
        suffix: " contributes to",
      }
    );

    console.log("✅ Welcome thread created successfully:", welcomeThread.id);
    return welcomeThread;
  } catch (error) {
    console.error("❌ Failed to create welcome thread:", error);
    throw error;
  }
}
