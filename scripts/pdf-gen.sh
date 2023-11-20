#!/bin/bash

# Please note this isn't accurate due to compression and things
approx_byte_size="${1:-2000000}"
file_name="random-$approx_byte_size";

rm -f "$file_name.pdf"
rm -f "$file_name-base64.txt"

# Generate random content dividing by 2 seems to give more accureate file sizes
openssl rand -out temp.txt $((approx_byte_size / 2))
random_text=$(cat temp.txt)
rm temp.txt

# Create html for wkhtmltopdf tool
echo "<html><body>PDF SIZE: $approx_byte_size bytes</br></br> $random_text</body></html>" > temp.html

# brew install wkhtmltopdf
# best tool I could find
wkhtmltopdf temp.html "$file_name.pdf";
rm temp.html

# Print file size as this generation isn't super accurate
file_size=$(stat -f "%z"  "$file_name.pdf")
echo "File size: $file_size bytes"
# Rename file to avoid confussion
mv "$file_name.pdf" "random-$file_size.pdf"
file_name="random-$file_size"

# Convert genterated pdf to base64 as pdf includes additional content
base64_pdf=$(base64 -i "./$file_name.pdf")
echo "$base64_pdf" > "$file_name-base64.txt"
