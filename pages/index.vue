<template>
  <div class="wrapper">
    <h1>All</h1>
    <ul>
      <li v-for="(article, index) in articlesAll" :key="index">
        <a :href="article.link">{{ article.title[0] }}</a>
      </li>
    </ul>
    <h1>Magazine</h1>
    <ul>
      <li v-for="(article, index) in articlesMagazine" :key="index">
        <a :href="article.link">{{ article.title[0] }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import xml2js from 'xml2js'

export const processors = xml2js.processors
export const xmlParser = xml2js.Parser({
  tagNameProcessors: [processors.stripPrefix],
})

export const BASE_KEY =
  'https://us-central1-mediation-server.cloudfunctions.net/api'
export const KEY_ALL = BASE_KEY + '/all'
export const KEY_MAGAZINE = BASE_KEY + '/magazine'

export default {
  data() {
    return {
      articlesMagazine: [],
      articlesAll: [],
    }
  },
  async mounted() {
    ;[this.articlesMagazine, this.articlesAll] = await Promise.all([
      await this.fetchArticles(KEY_ALL),
      await this.fetchArticles(KEY_MAGAZINE),
    ])
  },
  methods: {
    async fetchArticles(KEY) {
      let result = []
      const articles = await this.$axios.get(KEY).then((response) => {
        xmlParser.parseString(response.data, (messages, xmlres) => {
          result = xmlres.rss.channel[0].item
        })
        return result
      })
      return articles
    },
  },
}
</script>

<style>
.wrapper {
  padding: 20px;
}

h1 {
  margin-bottom: 10px;
}

ul {
  margin-bottom: 25px;
  padding-left: 20px;
}
</style>
