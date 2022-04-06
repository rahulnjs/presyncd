(function () {
    var $MAIN_VIEW = document.getElementById('main-view');

    var data = JSON.parse(document.getElementById('meta-data').innerText);

    var meta = data.topics;

    var _view = '';

    var batches = data.order;

    const $MODAL = initModal();

    const $MODAL_CONTENT = document.getElementById('modal-content');

    for (var batch of batches) {
        _view += drawBatch(batch);
        var topics = Object.keys(meta[batch]);
        for (var topic of topics) {
            _view += drawTopic(topic, meta[batch][topic], batch);
        }
        _view += '</div>'
    }

    $MAIN_VIEW.innerHTML = _view;

    (function addEventListeners() {
        document.addEventListener('click', function (e) {
            if (e.target.className === 'start-btn') {
                startNewPresentation(e);
            } else if (e.target.className === 's-btn') {
                if (e.target.attributes[1].value == 'c') {
                    copySlaveURL(e.target.attributes[2].value);
                }
            }
        });
    })();

    function startNewPresentation(e) {
        var uuid = uuidv4();
        fetch('/np', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "pid": uuid })
        })
            .then(res => res.json())
            .then(json => {
                if (json.ok) {
                    showPopup(e.target.attributes[1].value, uuid);
                } else {
                    console.log('something went wrong');
                }
            });
    }

    function showPopup(data, uuid) {
        data = window.location.origin + data;
        var _dataCpy = data.replace('_u_', uuid)
        var masterURL = _dataCpy.replace('_m_', 'm');
        var slaveURL = _dataCpy.replace('_m_', 's');
        var ndURL = data.split('/')
        ndURL.splice(5, 2);
        ndURL.splice(3, 0, 'nd')
        ndURL = ndURL.join('/');
        $MODAL_CONTENT.innerHTML = drawPLinks();
        $MODAL.style.display = 'block';

        function drawPLinks() {
            return `
                <div class="links">
                    <div class="link">
                        <div class="link-hdr">
                            Presenter's Link
                        </div>
                        <div class="link-url">
                            ${masterURL}
                            <div class="s-btn" data-action="o">
                                <a href="${masterURL}" target="_blank">Open</a>
                            </div>
                        </div>
                    </div>
                    <div class="link">
                        <div class="link-hdr">
                            Attendee's Link
                        </div>
                        <div class="link-url">
                            <input type="text" id="slave-url-1" class="copy-url" value="${slaveURL}" readonly>
                            <div class="s-btn" data-action="c" data-for="1">
                                Copy
                            </div>
                            <div class="copied" id="c-a-1">
                                &#10003; Copied
                            </div>
                        </div>
                    </div>
                    <div class="or">------ OR ------</div>
                    <div class="link">
                        <div class="link-hdr">
                            Independent Link
                        </div>
                        <div class="link-url">
                            <input type="text" id="slave-url-2" class="copy-url" value="${ndURL}" readonly>
                            <div class="s-btn" data-action="c" data-for="2">
                                Copy
                            </div>
                            <div class="copied" id="c-a-2">
                                &#10003; Copied
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }



    }

    function copySlaveURL(num) {
        var surl = document.getElementById('slave-url-' + num);
        surl.select();
        document.execCommand('copy');
        surl.selectionEnd = 0;
        document.getElementById('c-a-' + num).style.animation = 'copied-anim 2s 1 linear';
        setTimeout(function () {
            document.getElementById('c-a-' + num).style.animation = '';
        }, 1000);
    }

    function drawBatch(batch) {
        return `
            <div class="wrapper">
                <div class="batch">${batch}</div>`;
    }

    function drawTopic(topic, t, b) {
        return `
            <div class="topic">
                <img src="${t.logo}" class="cimg">
                <div class="name">${t.as}</div>
                <div class="start-btn" data-link="/p/${b}/_u_/_m_/${topic}">
                    Start
                </div>
            </div>
        `
    }

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).split('-')[1];
    }



    function initModal() {
        var modal = document.getElementById("myModal");
        var span = document.getElementsByClassName("close")[0];

        span.onclick = function () {
            modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        return modal;
    }


})();