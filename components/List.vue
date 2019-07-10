<template>
	<div>
        <div class="content content1"> {{id}} </div>
        <div class="content content2"> {{title}} </div>
        <div class="content content3"> {{content}} </div>
<!--         <div class="content content4">
          <button  :itemid="`${item.id}`" @click="insertEditNews" >Edit</button>
          <button :itemid="`${item.id}`" @click="delNews" >Delete</button>
        </div> -->
	</div>
</template>

<script>

export default {
	props: ['id', 'title', 'content']
}
</script>