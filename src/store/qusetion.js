// stores/question.js
import { defineStore } from 'pinia'

export const useQuestionStore = defineStore('question', {
  state: () => ({
    selectedQuestionId: null
  }),
  actions: {
    setSelectedQuestionId(id) {
      this.selectedQuestionId = id

    }
  }
})
