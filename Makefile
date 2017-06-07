all: clean lambda_function.zip

lambda_function.zip: index.js bin
	zip lambda_function.zip -r bin lib node_modules index.js
	@ls -lh lambda_function.zip

clean:
	rm -rf lambda_function.zip

deploy: clean lambda_function.zip
	terraform apply

.PHONY: clean deploy
