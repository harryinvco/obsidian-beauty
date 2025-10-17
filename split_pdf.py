#!/usr/bin/env python3
import sys
from PyPDF2 import PdfReader, PdfWriter
import math

def split_pdf(input_path, num_parts=3):
    reader = PdfReader(input_path)
    total_pages = len(reader.pages)
    pages_per_part = math.ceil(total_pages / num_parts)

    base_name = input_path.rsplit('.', 1)[0]

    for part_num in range(num_parts):
        writer = PdfWriter()
        start_page = part_num * pages_per_part
        end_page = min((part_num + 1) * pages_per_part, total_pages)

        for page_num in range(start_page, end_page):
            writer.add_page(reader.pages[page_num])

        output_path = f"{base_name}_part{part_num + 1}.pdf"
        with open(output_path, 'wb') as output_file:
            writer.write(output_file)

        print(f"Created {output_path} (pages {start_page + 1}-{end_page})")

if __name__ == "__main__":
    input_file = sys.argv[1] if len(sys.argv) > 1 else "fashion/Fashion Campaign to increase ROAS.pdf"
    split_pdf(input_file)
