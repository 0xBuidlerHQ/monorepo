.PHONY: dev app.trueorigin.com admin.trueorigin.com trueorigin.com

dev:
ifneq ($(filter app.trueorigin.com trueorigin.com,$(MAKECMDGOALS)),)
	node contracts/trueorigin.com/scripts/dev.mjs --app
else ifneq ($(filter admin.trueorigin.com,$(MAKECMDGOALS)),)
	pnpm --filter @0xhq/admin.trueorigin.com dev
else
	pnpm dev
endif

app.trueorigin.com admin.trueorigin.com trueorigin.com:
	@:
