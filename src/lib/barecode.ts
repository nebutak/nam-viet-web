import { Product } from "@/types";

export const handlePrintBarcodes = (products: Product[]) => {
  if (products.length === 0) return;

  console.log(products);

  const printWindow = window.open('', '', 'width=800,height=600');
  if (printWindow) {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>In Mã Vạch</title>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"><\/script>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 10px; }
          .barcode-item { 
            display: inline-block; 
            margin: 10px; 
            padding: 10px; 
            border: 1px solid #ddd; 
            text-align: center; 
            width: 200px;
            page-break-inside: avoid;
          }
          .barcode-item svg { max-width: 100%; }
          .product-name { font-size: 12px; font-weight: bold; margin-top: 5px; word-wrap: break-word; }
          .barcode-text { font-size: 11px; margin-top: 3px; color: #666; }
          @media print { 
            .barcode-item { margin: 5px; padding: 5px; }
          }
        </style>
      </head>
      <body>
    `;

    products.forEach((product) => {
      if (product.barcode) {
        html += `
          <div class="barcode-item">
            <svg id="barcode-${product.id}"><\/svg>
            <div class="product-name">${product.productName}</div>
            <div class="barcode-text">${product.barcode}</div>
          </div>
        `;
      }
    });

    html += `
        <script>
          ${products
            .filter((p) => p.barcode)
            .map(
              (product) => `
            try {
              JsBarcode("#barcode-${product.id}", "${product.barcode}", { format: "CODE128", height: 50, margin: 5 });
            } catch(e) {
              console.error('Error generating barcode for ${product.id}:', e);
            }
          `
            )
            .join('\n')}
          setTimeout(() => window.print(), 500);
        <\/script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  }
};