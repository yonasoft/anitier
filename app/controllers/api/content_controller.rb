module Api
  class ContentsController < ApplicationController
    before_action :set_content, only: [:show, :update, :destroy]

    def index
      @contents = Content.all
      render json: @contents
    end

    def show
      render json: @content
    end

    def create
      @content = Content.new(content_params)

      if @content.save
        render json: @content, status: :created
      else
        render json: @content.errors, status: :unprocessable_entity
      end
    end

    def update
      if @content.update(content_params)
        render json: @content
      else
        render json: @content.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @content.destroy
    end

    private
      def set_content
        @content = Content.find(params[:id])
      end

      def content_params
        params.require(:content).permit(:api_id, :content_type, :source, :tier_id)
      end
  end
end
