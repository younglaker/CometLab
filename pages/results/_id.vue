<template>
	<div>
		<nuxt-link to="/">Back</nuxt-link>
		<h3>Search results:</h3>
		<!-- <div>Id: {{$route.params.id}}</div> -->
		<div v-if="showFlag">
			<div>Id: {{id}} </div>
			<div>Title: {{title}} </div>
			<div>Content: {{content}} </div>
		</div>
		<div v-else>
			<p>Not found</p>
		</div>
	</div>
</template>

<script>
import gql from "graphql-tag";

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

export default {
	data() {
    return {
    	id: parseInt(this.$route.params.id), // id要从 string 转 int
    	title: '',
    	content: '',
    	showFlag: 0
    };
  },
  // 加载组件后立即执行
	mounted(){
		this.loadNews()
	},
  methods: {

  	loadNews () {
	    this.$apollo.query({
	      query: QUE_ID_NEWS,
	      variables: {
	        id: this.$data.id
	      }
	    })
	    .then(res => {
	    	if (res.data.news.length > 0) {
	    		// $data可以省略
	    		this.showFlag = 1
		      this.$data.title = res.data.news[0].title
		      this.$data.content = res.data.news[0].content
	    	}
	    })
  	}
  }

}
</script>