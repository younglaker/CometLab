<template>
  <div class="container">
<!--     <div>
      <logo />
      <h1 class="title">
        nuxtjs-cms
      </h1>
      <h2 class="subtitle">
        My incredible Nuxt.js project
      </h2>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div> -->
    <form @submit.prevent="addNews">
      Add: <input type="" name=""  >
    </form>

    <div class="table_block">
      <div class="table_title">
        <div class="title title1">ID</div>
        <div class="title title2">Title</div>
        <div class="title title3">Operation</div>
      </div>
      <div class="table_content" v-for="item in news" :key="item.id">
        <div class="content content1"> {{item.id}} </div>
        <div class="content content2"> {{item.title}} </div>
        <div class="content content3">
          <button >Edit</button>
          <button >Delete</button>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
// import Logo from '~/components/Logo.vue'

import gql from "graphql-tag";

const GET_NEWS = gql`
  query getMovies {
    news {
      id
      title
      content
      active
    }
  }
`;

export default {
  components: {
    // Logo
  },

  apollo: {
    news: {
      prefetch: true,
      query: GET_NEWS
    }
  },
  data() {
    return {
      news: []
    };
  },
  methods: {
    addNews(event) {
      console.log('message')
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  width: 1000vh;
  min-height: 100vh;
  /*display: flex;*/
  /*justify-content: center;*/
  /*align-items: center;*/
  /*text-align: center;*/
}
.table_title .title, .table_content .content {
  display: inline-block;
  margin-bottom: 10px;
}
.table_title .title1, .table_content .content1 {
  width: 100px;
}
.table_title .title2, .table_content .content2 {
  width: 400px;
}
.table_title .title3, .table_content .content3 {
  width: 500px;
}

</style>
