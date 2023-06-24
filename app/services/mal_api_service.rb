require 'net/http'
require 'uri'

class MalApiService
  MAL_API_BASE_URL = 'https://api.myanimelist.net/v2'
  CLIENT_ID = ENV['MAL_CLIENT_ID']

  def self.fetch_with_auth(url)
    uri = URI(url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Get.new(uri.request_uri, {'X-MAL-CLIENT-ID' => CLIENT_ID})

    response = http.request(request)
    raise "Error fetching data from MAL: #{response.message}" unless response.is_a?(Net::HTTPSuccess)

    JSON.parse(response.body)
  end

  def self.search_mal_content(content_type, query)
    content_type_as_string = get_content_type_as_string(content_type)
    url = "#{MAL_API_BASE_URL}/#{content_type_as_string}?q=#{query}"

    begin
      data = fetch_with_auth(url)
      data['data']
    rescue => e
      puts "Error occurred while searching for #{content_type}: #{e}"
      nil
    end
  end

  def self.fetch_mal_content(content_type, id)
    content_type_as_string = get_content_type_as_string(content_type)
    url = "#{MAL_API_BASE_URL}/#{content_type_as_string}/#{id}"

    begin
      fetch_with_auth(url)
    rescue => e
      puts "Error occurred while fetching #{content_type}: #{e}"
      nil
    end
  end

  def self.fetch_user_anime_list(username, status)
    url = "#{MAL_API_BASE_URL}/users/#{username}/animelist?status=#{status}"

    begin
      fetch_with_auth(url)
    rescue => e
      puts "Error fetching user's anime list: #{e}"
      nil
    end
  end

  def self.fetch_user_manga_list(username, status)
    url = "#{MAL_API_BASE_URL}/users/#{username}/mangalist?status=#{status}"

    begin
      fetch_with_auth(url)
    rescue => e
      puts "Error fetching user's manga list: #{e}"
      nil
    end
  end

  private

  def self.get_content_type_as_string(content_type)
    case content_type
    when :anime
      'anime'
    when :manga
      'manga'
    when :character
      'characters'
    else
      raise 'Invalid content type provided'
    end
  end
end
