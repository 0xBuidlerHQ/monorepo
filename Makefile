.PHONY: dev clean app.trueorigin.com admin.trueorigin.com trueorigin.com
.DEFAULT_GOAL := dev

clean:
	node scripts/clean.mjs

dev:
ifneq ($(filter app.trueorigin.com admin.trueorigin.com trueorigin.com,$(MAKECMDGOALS)),)
	node scripts/dev.mjs --trueorigin
else
	node scripts/dev.mjs
endif

app.trueorigin.com admin.trueorigin.com trueorigin.com:
	@:
