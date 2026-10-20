document.addEventListener("DOMContentLoaded", () => {
  // 1. Control del menú móvil
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }

  // 2. Acordeón profesional para tarjetas de servicios
  const serviceCards = document.querySelectorAll("[data-service-card]");
  const toggleCard = (selectedCard) => {
    serviceCards.forEach((card) => {
      if (card === selectedCard) {
        const isOpen = card.classList.toggle("open");
        card.setAttribute("aria-expanded", String(isOpen));
      } else {
        card.classList.remove("open");
        card.setAttribute("aria-expanded", "false");
      }
    });
  };
  serviceCards.forEach((card) => {
    card.addEventListener("click", () => toggleCard(card));
  });

  // 3. Calculadora Dinámica de Precios (Precios.html)
  const priceRows = document.querySelectorAll("[data-price-row]");
  const totalDisplay = document.getElementById("total-presupuesto");

  if (priceRows.length > 0 && totalDisplay) {
    const formatCurrency = (amount) => {
      return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USD";
    };

    const updateCalculator = () => {
      let grandTotal = 0;
      priceRows.forEach((row) => {
        const unitPrice = parseFloat(row.getAttribute("data-unit-price")) || 0;
        const qtyInput = row.querySelector(".qty-input");
        const subtotalElement = row.querySelector(".subtotal");
        
        let qty = parseInt(qtyInput.value) || 0;
        if (qty < 0) qty = 0;

        const subtotal = unitPrice * qty;
        grandTotal += subtotal;

        if (subtotalElement) {
          subtotalElement.textContent = formatCurrency(subtotal);
        }
      });

      totalDisplay.textContent = formatCurrency(grandTotal);
    };

    priceRows.forEach((row) => {
      const input = row.querySelector(".qty-input");
      if (input) {
        input.addEventListener("input", updateCalculator);
      }
    });

    updateCalculator(); // Cálculo inicial
  }

  // 4. Ondas de Datos Fluidas + Red de Nodos Interactiva con el Cursor (Global)
  const canvas = document.getElementById("ondas-fondo");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let nodes = [];
    
    const mouse = {
      x: null,
      y: null,
      radius: 140
    };

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || 400;
      nodes = Array.from({ length: 20 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1.5 + Math.random() * 2.2
      }));
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    let step = 0;
    const drawWaves = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(14, 165, 233, 0.08)");
      gradient.addColorStop(1, "rgba(37, 99, 235, 0.02)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Onda 1 (Cian)
      ctx.strokeStyle = "rgba(14,165,233,0.5)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.48);
      for (let x = 0; x <= canvas.width; x += 18) {
        const y = canvas.height * 0.48 + Math.sin(x * 0.012 + step) * 28 + Math.cos(x * 0.025 + step * 1.5) * 12;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // Onda 2 (Azul complementario)
      ctx.strokeStyle = "rgba(96,165,250,0.4)";
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.62);
      for (let x = 0; x <= canvas.width; x += 18) {
        const y = canvas.height * 0.62 + Math.cos(x * 0.0105 + step * 0.9) * 36 + Math.sin(x * 0.018 + step * 0.7) * 10;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // Red de nodos interactivos
      nodes.forEach((node, index) => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        ctx.beginPath();
        ctx.fillStyle = "rgba(148, 163, 184, 0.85)";
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = index + 1; j < nodes.length; j++) {
          const next = nodes[j];
          const distance = Math.hypot(node.x - next.x, node.y - next.y);
          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(next.x, next.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${1 - distance / 120})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const mouseDist = Math.hypot(node.x - mouse.x, node.y - mouse.y);
          if (mouseDist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(52, 211, 153, ${1 - mouseDist / mouse.radius})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      });

      step += 0.04;
      requestAnimationFrame(drawWaves);
    };
    
    drawWaves();
  }
});