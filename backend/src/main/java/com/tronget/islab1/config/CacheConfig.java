package com.tronget.islab1.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.NonNull;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
@EnableCaching
public class CacheConfig {
    public static final String LABWORK_BY_ID = "labworkById";
    public static final String COUNT_BY_TUNED_IN = "countByTunedInWorks";
    public static final String DEFAULT_CACHE_MANAGER = "defaultCacheManager";

    @Bean(DEFAULT_CACHE_MANAGER)
    public CacheManager defaultCacheManager() {
        var cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(caffeineCacheBuilder());
        return cacheManager;
    }

    public Caffeine<@NonNull Object, @NonNull Object> caffeineCacheBuilder() {
        return Caffeine.newBuilder()
                .initialCapacity(1000)
                .maximumSize(5000)
                .expireAfterWrite(Duration.ofMinutes(5));
    }
}
