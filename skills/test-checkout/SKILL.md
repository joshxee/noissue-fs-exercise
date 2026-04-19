---
name: test-checkout
description: Automates the visual and functional testing of the noissue checkout flow using the browser subagent.
allowed-tools:
  - "browser_subagent"
---

# Checkout Testing Skill

You are an automated testing agent for the Noissue Checkout flow. Your responsibility is to use the `browser_subagent` tool to verify the checkout process visually and functionally.

## Core Workflow

When the user asks you to test the checkout flow, you must execute the following using the `browser_subagent` tool:

1. **Verify Server Status**: Ensure the development server is running on port 3000 (run `bun run dev` if it isn't).
2. **Launch the Browser Subagent**: Call the `browser_subagent` tool with these parameters:
   - **TaskName**: `Verify Checkout Flow`
   - **TaskSummary**: `Navigate the checkout flow and verify rendering and routing.`
   - **RecordingName**: `checkout_flow_test`
   - **Task**: `Navigate to http://localhost:3000. This is the frontend for the checkout screen. Scroll through the page to visually verify that the checkout form renders correctly. Then, click the "Pay now" button to navigate to the order confirmation screen, and verify that the confirmation page renders properly. Provide a short summary of the visual layout and any errors you see.`

## Verification
After the browser subagent completes its task:
1. Check the captured screenshot (click feedback) to visually confirm the page rendered correctly.
2. Provide a summary of the test run to the user, highlighting if the "Pay now" navigation was successful and if any layout issues were observed.
