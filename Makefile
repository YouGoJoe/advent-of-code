.PHONY: new-day
new-day: ## Ex. make new-day day=## name=some-string
	mkdir 2024/${day}-${name}
	touch 2024/${day}-${name}/index.js
	touch 2024/${day}-${name}/input.js
