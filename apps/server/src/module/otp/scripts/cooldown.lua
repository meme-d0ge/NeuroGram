local key = KEYS[1]
local ttlSeconds = tonumber(ARGV[1])
local defaultValue = ARGV[2]

local currentTtl = redis.call('TTL', key)

if currentTtl == -2 then
	redis.call('SET', key, '', 'EX', ttlSeconds)
	return { "CREATED", ttlSeconds }
end
return { "EXISTED", currentTtl }