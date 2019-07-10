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
    <div>
      <!-- {{news}} -->
      <h3>Add news</h3>
      <!-- 获取input的值用v-model='modelName'，可以直接{{name}}来打印，要在 data里return modelName，才能在js里调用 this.modelName -->
      Title: <input type="" name=""  v-model="newNewsTitle">
      Content: <input type="" name=""  v-model="newNewsCont">
      <button v-on:click="addNews">Add</button>
    </div>
    <div>
      <h3>Edit news</h3>
      <!-- 获取input的值用v-model='modelName'，可以直接{{name}}来打印，要在 data里return modelName，才能在js里调用 this.modelName -->
      Title: <input type="" name=""  v-model="editNewsTitle">
      Content: <input type="" name=""  v-model="editNewsCont">
      <button v-on:click="editNews" :itemid="`${editNewsId}`">Edit</button>
    </div>
    <div>
      <h3>Search news</h3>
      <!-- 获取input的值用v-model='modelName'，可以直接{{name}}来打印，要在 data里return modelName，才能在js里调用 this.modelName -->
      Id: <input type="" name=""  v-model="searchId">
      <button v-on:click="searchNews">Search</button>
    </div>

    <div class="table_block">
      <div class="table_title">
        <div class="title title1">ID</div>
        <div class="title title2">Title</div>
        <div class="title title3">Content</div>
        <div class="title title4">Operation</div>
      </div>
      <div class="table_content" v-for="item in news" :key="item.id">
        <div class="content content1"> {{item.id}} </div>
        <div class="content content2"> {{item.title}} </div>
        <div class="content content3"> {{item.content}} </div>
        <div class="content content4">
          <button  :itemid="`${item.id}`" @click="insertEditNews" >Edit</button>
          <button :itemid="`${item.id}`" @click="delNews" >Delete</button>
        </div>
<!--         <List
          :id = "item.id"
          :title = "item.title"
          :content = "item.content"
        /> -->

      </div>
    </div>


  </div>
</template>

<script>
// import List from '~/components/List.vue'

import gql from "graphql-tag";

const GET_NEWS = gql`
query getNews {
  news (order_by: {id: asc}) {
    id
    title
    content
    active
  }
}
`;

const ADD_NEWS = gql`
mutation addNews ($title: String!, $content:String!) {
  insert_news(objects: {title: $title, content: $content, active: 1}) {
    affected_rows
    returning {
      id
      title
      content
      active
    }
  }
}
`;

const DEL_NEWS = gql`
mutation delteNews($id: Int!) {
  delete_news(where: {id: {_eq: $id}}) {
    affected_rows
    returning {
      id
    }
  }
}
`;

const QUE_ID_NEWS = gql`
query getIdNews ($id: Int!) {
  news(where: {id: {_eq: $id}}) {
    id
    content
    active
    title
  }
}
`;
const EDIT_NEWS = gql`
mutation editNews($id: Int!, $title: String!, $content: String!) {
  update_news(where: {id: {_eq: $id}}, _set: {title: $title, content: $content}) {
    returning {
      id
      title
      content
      active
    }
  }
}
`;

export default {
  components: {
    // List
  },

  apollo: {
    // 直接获取news，这里news是数据库返回的数据的名称，很表名一样
    news: {
      prefetch: true,
      query: GET_NEWS
    },
  },
  data() {
    return {
      news: [], // apollo的 news 同名
      newNewsTitle: '', //input 的 model
      newNewsCont: '',
      editNewsTitle: '',
      editNewsCont: '',
      editNewsId: -1,
      searchId: ''
      // idNews: []
    };
  },
  methods: {
    // 新增 news
    addNews(event) {
      // console.log('message')

      // 获取input内容
      const vtitle = this.newNewsTitle
      const vcontent = this.newNewsCont

      this.$apollo.mutate({
        mutation: ADD_NEWS,
        variables: {
          title: vtitle,
          content: vcontent,
        },
        update: (cache, {data: {insert_news}}) => {
          try {
            const data = cache.readQuery({
              query: GET_NEWS
            })
            const insrtedNews = insert_news.returning;
            // splice -----splice(index, num(0), item)
            // index------要插入的索引位置
            // num-------为0,如果不是0会替换当前索引处的值
            // item-------要插入的元素
            // 添加到最后一个
            data.news.splice(data.news.length, 0, insrtedNews[0]);
            // 添加到第一个
            // data.news.splice(0, 0, insrtedNews[0])
            cache.writeQuery({
              query: GET_NEWS,
              data
            })
          }
          catch (error) {
            console.log(error)
          }
        }

      })

    },
    // 把该内容插入到input里
    insertEditNews (event) {
      let element = event.currentTarget
      let itemid = element.getAttribute('itemid');
      // console.log(itemid)
      this.$apollo.query({
        query: QUE_ID_NEWS,
        variables: {
          id: itemid
        }
      })
      .then(res => {
        // console.log(res.data.news[0])
        // this.$data.idNews = res.data.news[0]
        this.$data.editNewsTitle = res.data.news[0].title
        this.$data.editNewsCont = res.data.news[0].content
        this.$data.editNewsId = res.data.news[0].id
        // console.log(this.$data.idNews)
        // console.log(this.$data.editNewsTitle)
      })
    },
    // 提交更改的内容
    editNews () {
      let element = event.currentTarget
      let itemid = element.getAttribute('itemid');

      // 获取input内容
      const vtitle = this.editNewsTitle
      const vcontent = this.editNewsCont

      this.$apollo.mutate({
        mutation: EDIT_NEWS,
        variables: {
          id: itemid,
          title: vtitle,
          content: vcontent
        }
      })
      .then(res => {
          // console.log(res.data.news[0])
          // this.$data.idNews = res.data.news[0]
          this.$data.editNewsTitle = ''
          this.$data.editNewsCont = ''
          this.$data.editNewsId = ''
        })
    },
    // 根据id删除news
    delNews (event) {
      let element = event.currentTarget
      let itemid = element.getAttribute('itemid');
      // console.log(itemid)

      this.$apollo.mutate({
        mutation: DEL_NEWS,
        variables: {
          id: itemid
        },
        // 更新缓存
        update: (store, { data: { delete_news } }) => {
          try {
           if (delete_news.affected_rows) {
             const data = store.readQuery({
               query: GET_NEWS
             });
             // console.log(data.news)
               // 过滤掉删除的item
               data.news = data.news.filter(t => {
                // 如果不用parseInt，就用 !=
                // 返回除了 itemid 的 item
                return parseInt(t.id) !== parseInt(itemid);
              });
               // console.log(data.news)
               store.writeQuery({
                 query: GET_NEWS,
                 data
               });
             }
           }
           catch (error) {
            console.log(error)
          }
        }

/*       update: (cache, { data: { delete_news } }) => {
         if (delete_news.affected_rows) {
           const data = cache.readQuery({
             query: GET_NEWS,
           });
           data.news = data.news.filter((item) => parseInt(item.id) !== parseInt(itemid) );
           cache.writeQuery({
             query: GET_NEWS,
             data
           });
         }
       }*/

     })

    },
    // 根据id搜索news
    searchNews () {
      // 这里是单引号，$router，不是route
      // this.$router.push('results');
      // 这里是`号
      this.$router.push(`results/${this.searchId}`);

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
  width: 300px;
}
.table_title .title3, .table_content .content3 {
  width: 400px;
}
.table_title .title4, .table_content .content4 {
  width: 200px;
}

</style>
