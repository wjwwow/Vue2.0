import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-admin-template/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-admin-template/article/detail',
    method: 'get',
    params: { id }
  })
}


export function updateArticle(data) {
  return request({
    url: '/vue-admin-template/article/update',
    method: 'post',
    data
  })
}
