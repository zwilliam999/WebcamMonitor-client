<template>
    <div id="wrapper">
        <!-- Header -->
        <header id="header">
            <div class="inner">
                <!-- Logo -->
                <a href="/" class="logo">
                    <span class="symbol"><img src="../assets/image/logo.svg" alt=""/></span><span class="title">WebcamMonitor</span>
                </a>

                <!-- Nav -->
                <nav>
                    <ul>
                        <li><a href="javascript:void(0)" @click="showGetRtmp">
                            <img src="../assets/image/upload.svg" alt=""></a>
                        </li>
                        <!-- <li><a href="#menu"></a></li>-->
                    </ul>
                </nav>

            </div>
        </header>
        <!-- Menu -->
        <nav id="menu">
            <h2>About</h2>
            <ul>
                <li><a href="#">更多游戏</a></li>
            </ul>
        </nav>
        <!-- Main -->
        <div id="main">
            <div class="inner">
                <header>
                    <h1>Store video surveillance data on filecoin<br/></h1>
                    <p>You can view the data we have already stored, but the push URL will be released later, and you
                        can store your own data.</p>
                </header>
                <section class="tiles">
                    <article class="style1" v-for="item in list">
                        <span class="image">
                            <img src="../assets/image/mikutap.png" alt=""/>
                        </span>
                        <a href="javascript:void(0)">
                            <h2>{{item.cameraName}}</h2>
                            <div class="content">
                                <p>You can’t preview it yet, but it will be available soon.</p>
                            </div>
                        </a>
                    </article>
                </section>
                <div class="news-load-more" @click="getVideoList" v-if="this.totalPages >= this.params.page">
                    <span>加载更多</span></div>
            </div>
        </div>

        <!-- Footer -->
        <footer id="footer">
            <div class="inner">
                <ul class="copyright">
                    <li>&copy; WebcamMonitor</li>
                    <li>For SpaceRace2</li>
                    <li><a href="https://github.com/filecoin-project">filecoin-project</a></li>
                    <li><a href="https://slingshot.filecoin.io/">slingshot</a></li>
                </ul>
            </div>
        </footer>
    </div>
</template>

<script>
    import main from "../assets/js/main"
    import Swal from 'sweetalert2'

    export default {
        name: 'Home',
        data() {
            return {
                list: [],
                params: {
                    page: 0,
                    size: 12
                },
                totalPages: 0,
                nextable: true
            }
        },
        mounted() {
            main($);
            this.getVideoList();
        },
        methods: {
            getVideoList() {
                this.$root.api.webcamList(this.params).then((res) => {
                    this.list = this.list.concat(res.data.data.content);
                    this.totalPages = res.data.data.totalPages;
                    this.$set(this.params, "page", this.params.page + 1)
                    this.params.page += 1;
                    this.nextable = this.totalPages > this.params.page
                    console.log(this.totalPages, this.params.page)
                }).catch(err => {
                });
            },
            async showGetRtmp() {
                let {value: formValues} = await Swal.fire({
                    title: 'GET YOUR INFO',
                    html:
                        '<input id="swal-input1" class="swal2-input" placeholder="give us a webcam name...(required)" required>' +
                        '<input id="swal-input2" class="swal2-input" placeholder="camera model">' +
                        '<input id="swal-input3" class="swal2-input" placeholder="camera remark">',
                    focusConfirm: false,
                    confirmButtonText: 'GET IT',
                    preConfirm: () => {
                        return [
                            document.getElementById('swal-input1').value,
                            document.getElementById('swal-input2').value,
                            document.getElementById('swal-input3').value
                        ]
                    }
                });
                if (formValues && formValues[0] === '') {
                    await Swal.fire("give us a webcam name please!");
                    this.showGetRtmp()
                } else if (formValues) {
                    this.$root.api.webcamAdd({
                        cameraName: formValues[0],
                        cameraModel: formValues[1],
                        remark: formValues[2],
                    }).then(async res => {
                        let {value: rs} = await Swal.fire({
                            title: 'Your rtmp server info',
                            html:
                                `<input id="swal-input1" class="swal2-input" value="ADDR: ${res.data.data.streamAddress}" readonly><input id="swal-input2" class="swal2-input" value="KEY: ${res.data.data.streamKey}" placeholder="camera model" readonly>`,
                            focusConfirm: false,
                            confirmButtonText: 'push stream',
                        });
                        if (rs) {
                            this.shotStart(res.data.data.id)
                        }
                    }).catch((err) => {
                        window.sb.tip({
                            msg: 'err...',
                            duration: 2000
                        })
                    })
                }
            },
            shotStart(cameraId) {
                this.$root.api.shotStart({cameraId}).then(res => {
                    sb.tip({
                        type: "success",
                        msg: res.data.message,
                        duration: 2000
                    })
                }).catch(err => {
                })
            }
        }
    }
</script>
<style>
    .news-load-more {
        margin: 30px auto;
        font-size: 14px;
        letter-spacing: 1px;
        text-align: center;
        cursor: pointer;
        line-height: 31px;
        background-color: #e5e5e5;
        color: #8d8c8c;
    }
</style>
