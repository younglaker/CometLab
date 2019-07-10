<template>
	<div>
		<h3>Search results:</h3>
		<!-- <div>Id: {{$route.params.id}}</div> -->
		<div>Id: {{id}} </div>
		<div>Title: {{title}} </div>
		<div>Content: {{content}} </div>
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
    	id: this.$route.params.id,
    	title: '',
    	content: ''
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
	      this.$data.title = res.data.news[0].title
	      this.$data.content = res.data.news[0].content
	    })
  	}
  }

}
</script>