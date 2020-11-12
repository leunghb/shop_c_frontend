<template>
    <div class="search fullscreen">
        <div class="header">
            <van-icon class="backIcon" name="arrow-left" @click="back()" />
            <van-search
                class="search"
                v-model="searchValue"
                show-action
                placeholder="请输入搜索关键词"
                @search="search"
            >
                <template #action>
                    <div @click="search">搜索</div>
                </template>
            </van-search>
        </div>

        <van-list
            class="list"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <van-cell v-for="item in list" :key="item" :title="item" />
        </van-list>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchValue: "",
            // 列表
            list: [],
            loading: false,
            finished: false,
        };
    },
    methods: {
        search() {},
        onLoad() {
            // 异步更新数据
            // setTimeout 仅做示例，真实场景中一般为 ajax 请求
            setTimeout(() => {
                for (let i = 0; i < 10; i++) {
                    this.list.push(this.list.length + 1);
                }

                // 加载状态结束
                this.loading = false;

                // 数据全部加载完成
                if (this.list.length >= 40) {
                    this.finished = true;
                }
            }, 1000);
        },
        back() {
            this.$router.go(-1);
        },
    },
};
</script>

<style lang="scss" scoped>
@import "./search.scss";
@import "../../static/css/common.scss";
</style>