let mainButton = document.getElementById("mainButton");

mainButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: runExtension,
    });
});

function runExtension() {
    console.clear();

    // Testes: https://wwww.ifood.com.br/restaurantes?deliveryFeeMax=0&payment_types=ALR%2CVVREST
    //https://wwww.ifood.com.br/restaurantes?deliveryFeeMax=500&payment_types=ALR%2CVVREST&sort=delivery_fee%3Aasc

    function cleanRestaurantList() {
        // Retirar "últimas lojas e favoritos"
        const annoyingElements = document.querySelector(
            '[data-test-id="cardstack-article-container"]'
        );
        //console.log(annoyingElements)
        const killList = [
            "ROUND_IMAGE_CAROUSEL",
            "IMAGE_BANNER",
            "SMALL_BANNER_CAROUSEL",
        ];
        let restaurantsList;
        annoyingElements.childNodes.forEach((element) => {
            if (killList.includes(element.getAttribute("data-card-name"))) {
                element.remove();
            } else if (
                element.getAttribute("data-card-name") == "MERCHANT_LIST_V2"
            ) {
                restaurantsList = element.querySelector(
                    ".merchant-list-v2__wrapper"
                );
            }
        });

        // Esconder restaurantes fechados e blacklisted
        const blacklist = [
            "https://wwww.ifood.com.br/delivery/campinas-sp/olive-garden---shopping-parque-dom-pedro-jardim-santa-genebra/18ae4a8c-7887-4bd5-9dab-9d40ff8a9be0",
            "https://wwww.ifood.com.br/delivery/campinas-sp/marmitas-di-capri-cidade-universitaria/d797c3e6-b7ad-4558-9733-6bd8a7f0896f",
            "https://wwww.ifood.com.br/delivery/campinas-sp/famiglia-feliccio-jardim-chapadao/3ce0d2ca-bf49-4ad1-a33d-7d77930868be",
            "https://wwww.ifood.com.br/delivery/campinas-sp/sim-parmegiana-e-strogonoff-taquaral/54693ea4-3107-4271-ad84-2da82e24d532",
            "https://wwww.ifood.com.br/delivery/campinas-sp/pizzaria-di-capri-barao-geraldo/ab68a282-7486-4141-81b1-02183bdcc2f6",
            "https://wwww.ifood.com.br/delivery/campinas-sp/engenharia-da-pizza----barao-geraldo-jardim-novo-barao-geraldo/d9d10684-a428-4d48-adbb-238f2e264621",
            "https://wwww.ifood.com.br/delivery/campinas-sp/mr-camarao-jardim-chapadao/6be692ca-a083-4137-8c05-c36c527dc78b",
            "https://wwww.ifood.com.br/delivery/campinas-sp/camarao-do-chef-jardim-chapadao/860dbfb4-68d8-47b3-b22e-dc2cd4d4a149",
            "https://wwww.ifood.com.br/delivery/campinas-sp/master-chef-camarao-jardim-chapadao/60ff317f-bd61-47e1-9380-f8c852b12e0e",
            "https://wwww.ifood.com.br/delivery/campinas-sp/estacao-das-pizzas---barao-geraldo-jardim-santa-genebra-ii-barao-geraldo/7cf991af-7408-40e8-aebb-12aed45ff66a",
            "https://wwww.ifood.com.br/delivery/campinas-sp/bankai-sushi-jardim-nossa-senhora-auxiliadora/7bb1c5f0-8e3c-4569-a221-21a0494b522c",
        ];
        for (let restaurant of restaurantsList.childNodes) {
            let footer = restaurant.querySelector(".merchant-v2__footer")
                .firstChild.textContent;
            if (blacklist.includes(restaurant.querySelector("a").href)) {
                restaurant.remove();
            } else if (footer.includes("Fechado") || footer.includes("entre")) {
                restaurant.remove();
            }
        }
    }

    function cleanCouponList() {
        const disabledCoupons = document
            .querySelector(".voucher-dialog-content__list")
            .querySelectorAll(".voucher-card--disabled");
        disabledCoupons.forEach((coupon) => {
            coupon.remove();
        });
    }

    function removePopUp() {
        const popUp = document.querySelector(".multi-categories-hint");
        popUp.remove();
    }

    function removeOverlay() {
        //const overlay = document.getElementsByClassName("marmita-modal__overlay marmita-modal--dialog-overlay marmita-modal__overlay--animation-bottom marmita-modal__overlay--after-open")[0]
        //overlay.remove()
        //window.location.reload();
        const okEntendiBtn = document.querySelector('[label="Ok, entendi"]');
        okEntendiBtn.click();
    }

    function addAddress() {
        const buttons = document.querySelectorAll(".btn__label");
        buttons.forEach((btn) => {
            if (btn.textContent == "Informar") {
                btn.click();

                let addressListExists = setInterval(() => {
                    let addressList = document.querySelector(".address-list");
                    if (addressList) {
                        addressList.firstChild
                            .querySelector(".btn-address--full-size")
                            .click();
                        clearInterval(addressListExists);
                    }
                }, 100);
            }
        });
    }

    function clickNextContent() {
        const nextContent = document.getElementsByClassName(
            "btn btn--default btn--white btn--size-m btn--full-width cardstack-nextcontent__button"
        )[0];
        nextContent.click();
    }

    function removeClosedList() {
        const list = document.getElementsByClassName(
            "catalog-item-v2-content__container-unavailable"
        );
        let listLength = list.length;
        while (listLength > 0) {
            list[0].parentNode.parentNode.parentNode.remove();
            listLength = list.length;
        }
    }

    function reloadPageIfNotFound() {
        const notFound = document.querySelector(".page-not-found");
        if (notFound) {
            window.location.reload();
        }
    }

    function removerMercadosEConveniencias() {
        const merchantInfos = document.querySelectorAll(".merchant-v2__info");
        const pathname = window.location.pathname;
        if (pathname == "/restaurantes") {
            merchantInfos.forEach((merchantInfo) => {
                if (
                    merchantInfo.textContent.includes("Mercado") ||
                    merchantInfo.textContent.includes("Conveniência")
                ) {
                    merchantInfo.parentNode.parentNode.parentNode.parentNode.remove();
                }
            });
        }
    }

    function run() {
        try {
            cleanRestaurantList();
        } catch (error) {
            //console.log("sad vibes restaurant")
        }

        try {
            removePopUp();
        } catch (error) {
            //console.log("sad vibes popUp")
        }

        try {
            cleanCouponList();
        } catch (error) {
            //console.log("sad vibes coupon")
        }

        try {
            removeOverlay();
        } catch (error) {
            //console.log("sad vibes ")
        }

        try {
            addAddress();
        } catch (error) {
            //console.log("sad vibes ")
        }

        try {
            clickNextContent();
        } catch (error) {
            //console.log("sad vibes ")
        }

        try {
            removeClosedList();
        } catch (error) {
            //console.log("sad vibes ")
        }

        try {
            reloadPageIfNotFound();
        } catch (error) {}

        try {
            removerMercadosEConveniencias();
        } catch (error) {}

        console.log("running");
    }

    let clear = setInterval(console.clear, 10000);

    let exec = setInterval(run, 250);
}
