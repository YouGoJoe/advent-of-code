.PHONY: new-day
new-day: ## Ex. make new-day day=## name=some-string
	mkdir 2023/${day}-${name}
	touch 2023/${day}-${name}/index.js
	touch 2023/${day}-${name}/input.js
