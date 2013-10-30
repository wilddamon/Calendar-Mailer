#!/bin/sh

js_files="javascript/*.js"
js_more_files="javascript/*/*.js"
js_even_more_files="javascript/*/*/*.js"
soy_files="soy/*.soy"
css_files="css/*.css"

out_dir="genfiles"
closure_out_dir="$out_dir/closure-gen"
soy_out_dir="$out_dir/soy_gen"

# Check whether directories exist.
if [ -d $out_dir ]; then
  rm -r $out_dir
fi

mkdir $out_dir
mkdir $closure_out_dir
mkdir $soy_out_dir

echo "***Running gjslint***"
gjslint --closurized_namespaces=calendarmailer,goog,soy \
    --strict ${js_files[@]} ${js_more_files[@]} ${js_even_more_files[@]}

echo "***Running SoyToJsSrcCompiler***"
java -jar ../soy-latest/SoyToJsSrcCompiler.jar \
  --shouldGenerateJsdoc \
  --shouldProvideRequireSoyNamespaces \
  --outputPathFormat $soy_out_dir/{INPUT_FILE_NAME_NO_EXT}.js \
  ${soy_files[@]}

echo "***Running closurebuilder***"
../closure-library/closure/bin/build/closurebuilder.py \
    --root=../closure-library/ \
    --root=../soy-latest/ \
    --root=javascript/ \
    --root=$soy_out_dir \
    --namespace="calendarmailer.picker.App" \
    --output_mode=script \
    --compiler_jar=../compiler-latest/compiler.jar \
    > $closure_out_dir/pickerapp.js
../closure-library/closure/bin/build/closurebuilder.py \
    --root=../closure-library/ \
    --root=../soy-latest/ \
    --root=javascript/ \
    --root=$soy_out_dir \
    --namespace="calendarmailer.dashboard.App" \
    --output_mode=script \
    --compiler_jar=../compiler-latest/compiler.jar \
    > $closure_out_dir/dashboard.js

echo "***Running css compiler***"
java -jar ../css-compiler/closure-stylesheets-20111230.jar \
    ../closure-library/closure/goog/css/checkbox.css \
    ../closure-library/closure/goog/css/common.css \
    ${css_files[@]} \
    --output-file $closure_out_dir/app.css \
    --pretty-print

