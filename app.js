// Interactivity for the static АГРОНАВТ page: protocol accordion,
// checklist, batch-economics calculator and cookie notice.
(function () {
  var MIN_TRAYS = 100;

  // Protocol accordion — one stage open at a time, clicking the open one closes it.
  var stages = Array.prototype.slice.call(document.querySelectorAll('.stage'));
  stages.forEach(function (stage) {
    var head = stage.querySelector('.stage-head');
    if (!head) return;
    head.addEventListener('click', function () {
      var wasOpen = stage.classList.contains('active');
      stages.forEach(function (other) {
        other.classList.remove('active');
        var otherHead = other.querySelector('.stage-head');
        if (otherHead) otherHead.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        stage.classList.add('active');
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Checklist items toggle their completed state.
  document.querySelectorAll('.checklist button').forEach(function (item) {
    item.addEventListener('click', function () {
      var checked = item.classList.toggle('checked');
      item.setAttribute('aria-pressed', checked ? 'true' : 'false');
    });
  });

  // Calculator.
  var costInput = document.getElementById('calc-cost');
  var priceInput = document.getElementById('calc-price');
  var traysOutput = document.getElementById('calc-trays');
  var results = {};
  document.querySelectorAll('[data-result]').forEach(function (node) {
    results[node.getAttribute('data-result')] = node;
  });

  if (costInput && priceInput && traysOutput) {
    var trays = parseInt(traysOutput.textContent, 10) || MIN_TRAYS;
    var currency = function (value) {
      return new Intl.NumberFormat('ru-RU').format(Math.round(value)) + ' ₽';
    };

    var render = function () {
      var cost = Math.max(0, Number(costInput.value) || 0);
      var price = Math.max(0, Number(priceInput.value) || 0);
      traysOutput.textContent = trays;
      if (results.revenue) results.revenue.textContent = currency(price * trays);
      if (results.costs) results.costs.textContent = currency(cost * trays);
      if (results.profit) results.profit.textContent = currency((price - cost) * trays);
      if (results.margin) {
        results.margin.textContent = (price > 0 ? ((price - cost) / price) * 100 : 0).toFixed(1) + '%';
      }
      if (results.perTray) results.perTray.textContent = currency(price - cost);
    };

    costInput.addEventListener('input', render);
    priceInput.addEventListener('input', render);
    document.querySelectorAll('.counter button[data-step]').forEach(function (button) {
      button.addEventListener('click', function () {
        trays = Math.max(MIN_TRAYS, trays + Number(button.getAttribute('data-step')));
        render();
      });
    });

    render();
  }

  // Cookie notice.
  var notice = document.querySelector('.cookie-notice');
  var dismiss = document.querySelector('[data-cookie-dismiss]');
  if (notice && dismiss) {
    dismiss.addEventListener('click', function () {
      notice.remove();
    });
  }
})();
