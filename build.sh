#!/bin/sh

rm closure-gen/*

js_files="scripts/*.js"
js_ui_files="scripts/ui/*.js"
soy_files="soy/*.soy"

gjslint ${js_files[@]} ${js_ui_files[@]}

java -jar ../soy-latest/SoyToJsSrcCompiler.jar \
  --shouldGenerateJsdoc \
  --shouldProvideRequireSoyNamespaces \
  --outputPathFormat soy-gen/{INPUT_FILE_NAME_NO_EXT}.js \
  ${soy_files[@]}

../closure-library/closure/bin/build/closurebuilder.py \
    --root=../closure-library/ \
    --root=scripts/ \
    --root=soy-gen \
    --namespace="calendarmailer.App" \
    --output_mode=script \
    --compiler_jar=../compiler-latest/compiler.jar \
    > closure-gen/app.js

java -jar ../css-compiler/closure-stylesheets-20111230.jar \
    ../closure-library/closure/goog/css/button.css \
    ../closure-library/closure/goog/css/checkbox.css \
    ../closure-library/closure/goog/css/common.css \
    --output-file closure-gen/app.css \
    --pretty-print
    