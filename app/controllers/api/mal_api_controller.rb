module Api
    class MalApiController < ApplicationController
        def search_mal_content
            content_type = params[:content_type].to_sym  # Convert string to symbol
            query = params[:query]
            result = MalApiService.search_mal_content(content_type, query)
            render json: result
        end

        def fetch_mal_content
            content_type = params[:content_type].to_sym  # Convert string to symbol
            id = params[:id]
            result = MalApiService.fetch_mal_content(content_type, id)
            render json: result
        end

        def fetch_user_anime_list
            username = params[:username]
            status = params[:status]
            result = MalApiService.fetch_user_anime_list(username, status)
            render json: result
        end

        def fetch_user_manga_list
            username = params[:username]
            status = params[:status]
            result = MalApiService.fetch_user_manga_list(username, status)
            render json: result
        end
    end
end