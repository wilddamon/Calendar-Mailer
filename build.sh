#!/bin/sh

rm genfiles/closure-gen/*
rm genfiles/soy-gen/*

js_files="javascript/*.js"
js_more_files="javascript/*/*.js"
js_even_more_files="javascript/*/*/*.js"
soy_files="soy/*.soy"
css_files="css/*.css"

out_folder="genfiles/"

echo "***Running gjslint***"
gjslint --closurized_namespaces=calendarmailer,goog,soy \
    --strict ${js_files[@]} ${js_more_files[@]} ${js_even_more_files[@]}

echo "***Running SoyToJsSrcCompiler***"
java -jar ../soy-latest/SoyToJsSrcCompiler.jar \
  --shouldGenerateJsdoc \
  --shouldProvideRequireSoyNamespaces \
  --outputPathFormat genfiles/soy-gen/{INPUT_FILE_NAME_NO_EXT}.js \
  ${soy_files[@]}

echo "***Running closurebuilder***"
../closure-library/closure/bin/build/closurebuilder.py \
    --root=../closure-library/ \
    --root=javascript/ \
    --root=genfiles/soy-gen \
    --namespace="calendarmailer.PickerApp" \
    --output_mode=script \
    --compiler_jar=../compiler-latest/compiler.jar \
    > genfiles/closure-gen/pickerapp.js

echo "***Running css compiler***"
java -jar ../css-compiler/closure-stylesheets-20111230.jar \
    ../closure-library/closure/goog/css/button.css \
    ../closure-library/closure/goog/css/checkbox.css \
    ../closure-library/closure/goog/css/common.css \
    ${css_files[@]} \
    --output-file genfiles/closure-gen/app.css \
    --pretty-print
    