Feature: Prefs
  I should be able to change my cli preferences

  Scenario: Prefs command to change language using flags
    Given I have already logged in
    When I run prefs command with changelang using 'flags'
    Then I should be able to change the submission language

  Scenario: Prefs command to change language using prompt
    Given I have already logged in
    When I run prefs command with changelang using 'prompt'
    Then I should be able to change the submission language

  Scenario: Prefs command to change language for invalid language
    Given I have already logged in
    When I run prefs command with changelang with invalid language
    Then I should be displayed an error message for invalid language

  Scenario: Prefs command to change gitlab server using flags
    Given I have already logged in
    When I run prefs command with changeserver using 'flags' for 'gitlab'
    Then I should be able to change the gitlab server

  Scenario: Prefs command to change main server using flags
    Given I have already logged in
    When I run prefs command with changeserver using 'flags' for 'ms'
    Then I should be able to change the main server

  Scenario: Prefs command with invalid host for main server
    Given I have already logged in
    When I run change server with invalid host for 'ms'
    Then I should be displayed an error message for invalid host

  Scenario: Prefs command with invalid host for gitlab server
    Given I have already logged in
    When I run change server with invalid host for 'gitlab'
    Then I should be displayed an error message for invalid host

  Scenario: Prefs command with invalid port
    Given I have already logged in
    When I run change server with invalid port
    Then I should be displayed an error message for invalid port

  Scenario: Prefs command to change main server using prompt
    Given I have already logged in
    When I run prefs command with changeserver using 'prompt' for 'ms'
    Then I should be able to change the main server

  Scenario: Prefs command to change gitlab server using prompt
    Given I have already logged in
    When I run prefs command with changeserver using 'prompt' for 'gitlab'
    Then I should be able to change the gitlab server

  Scenario: Prefs command to change logger file size using flags
    Given I have already logged in
    When I run prefs command with logger using 'flags' for 'maxsize'
    Then I should be able to change logger file size

  Scenario: Prefs command to change logger blacklist size using flags
    Given I have already logged in
    When I run prefs command with logger using 'flags' for 'blacklist'
    Then I should be able to change logger blacklist

  Scenario: Prefs command to change logger file size using prompt
    Given I have already logged in
    When I run prefs command with logger using 'prompt' for 'maxsize'
    Then I should be able to change logger file size

  Scenario: Prefs command to change logger blacklist again size using prompt
    Given I have already logged in
    When I run prefs command with logger using 'prompt' for 'blacklist'
    Then I should be displayed an error message for invalid keyword

  Scenario: Prefs command to show preferences
    Given I have already logged in
    When I run prefs command with show
    Then I should be able to see the preferences
