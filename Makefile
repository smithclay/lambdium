
# A Self-Documenting Makefile: http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html

ZIP_ARCHIVE = lambda_function.zip
COMMIT_HASH = `git rev-parse --short HEAD 2>/dev/null`
BUILD_DATE = `date +%FT%T%z`

.PHONY: clean deploy
.DEFAULT_GOAL := help

lambda: clean index.js bin ## Create lambda function zip
	zip -dd -9 ${ZIP_ARCHIVE} -r bin lib node_modules index.js
	@ls -lh ${ZIP_ARCHIVE}

clean: ## Clean lambda function zip
	rm -rf ${ZIP_ARCHIVE}

deploy: clean lambda ## Deploy lambda function with terraform
	terraform apply

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
