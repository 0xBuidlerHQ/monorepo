.PHONY: dev app.trueorigin.com admin.trueorigin.com trueorigin.com

dev:
ifneq ($(filter app.trueorigin.com admin.trueorigin.com trueorigin.com,$(MAKECMDGOALS)),)
	node scripts/dev.mjs --trueorigin
else
	node scripts/dev.mjs
endif

app.trueorigin.com admin.trueorigin.com trueorigin.com:
	@:
