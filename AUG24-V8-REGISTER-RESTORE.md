# ERJ v8 · Register Page Restore · 24 Aug 2026

This patch restores the Register page presentation styles that were accidentally removed while deleting the retired Inner Circle countdown block.

Restored without rolling back the approved commercial changes:
- product-card grid and card styling
- pricing typography and feature lists
- section labels and discount/info panels
- Paystack/payment information card styling
- payment action button layout
- mobile one-column product-card behaviour

Preserved current commercial rules:
- Inner Circle: ₦250,000 once, private 1:1, no ₦135,000 part payment, no timer
- Cohort 10 reservation: ₦50,000 after fit confirmation, ₦200,000 balance by 30 Aug 2026 6 PM WAT
- reservation may move to the next cohort or be refunded on request less applicable bank/payment service charges

Also removed the obsolete crossed-out ₦400,000 Inner Circle anchor from the Register page.
Service-worker cache: erj-v132-register-restored.
